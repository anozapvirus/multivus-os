import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        companyCode: { label: "Código da Empresa", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password || !credentials?.companyCode) {
          return null
        }

        // Buscar empresa pelo código
        const company = await prisma.company.findFirst({
          where: {
            document: credentials.companyCode,
            active: true,
            planExpiresAt: { gte: new Date() },
          },
        })

        if (!company) {
          throw new Error("Empresa não encontrada ou plano vencido")
        }

        // Buscar usuário
        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email,
            companyId: company.id,
            active: true,
          },
          include: {
            company: true,
            branch: true,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId,
          branchId: user.branchId,
          company: user.company,
        }
      },
    }),
    CredentialsProvider({
      id: "client-login",
      name: "Client Login",
      credentials: {
        document: { label: "CPF/CNPJ", type: "text" },
        phone: { label: "Telefone", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.document || !credentials?.phone) {
          return null
        }

        const customer = await prisma.customer.findFirst({
          where: {
            document: credentials.document,
            phone: credentials.phone,
            active: true,
          },
          include: {
            company: true,
          },
        })

        if (!customer) {
          return null
        }

        // Verificar se a empresa está ativa
        if (!customer.company.active || customer.company.planExpiresAt < new Date()) {
          throw new Error("PLAN_EXPIRED")
        }

        return {
          id: customer.id,
          name: customer.name,
          document: customer.document,
          type: "CLIENT",
          companyId: customer.companyId,
        }
      },
    }),
    CredentialsProvider({
      id: "superadmin-login",
      name: "SuperAdmin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
        twoFactorCode: { label: "Código 2FA", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Verificar se é superadmin (hardcoded por segurança)
        if (credentials.email !== "superadmin@multivus.com" || credentials.password !== "SuperAdmin@2024") {
          return null
        }

        // Em produção, implementar 2FA real
        if (credentials.twoFactorCode !== "123456") {
          throw new Error("Código 2FA inválido")
        }

        return {
          id: "superadmin",
          email: credentials.email,
          name: "Super Administrador",
          role: "SUPERADMIN",
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.companyId = user.companyId
        token.branchId = user.branchId
        token.type = user.type || "USER"
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub!
      session.user.role = token.role as string
      session.user.companyId = token.companyId as string
      session.user.branchId = token.branchId as string
      session.user.type = token.type as string
      return session
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/auth/error",
  },
}
