export const WORK_ORDER_STATUS_LABELS = {
  DRAFT: "Rascunho",
  TRIAGING: "Em Triagem",
  AWAITING_APPROVAL: "Aguardando Aprovação",
  AWAITING_PARTS: "Aguardando Peças",
  IN_PROGRESS: "Em Andamento",
  QUALITY_CHECK: "Controle de Qualidade",
  READY_FOR_PICKUP: "Pronto para Retirada",
  DELIVERED: "Entregue",
  COMPLETED: "Finalizado",
  WARRANTY: "Garantia",
  RMA: "RMA",
  CANCELLED: "Cancelado",
} as const

export const PRIORITY_LABELS = {
  LOW: "Baixa",
  MEDIUM: "Média",
  HIGH: "Alta",
  URGENT: "Urgente",
} as const

export const USER_ROLE_LABELS = {
  ADMIN: "Administrador",
  MANAGER: "Gestor",
  TECHNICIAN: "Técnico",
  ATTENDANT: "Atendente",
  FINANCIAL: "Financeiro",
  CLIENT: "Cliente",
} as const

export const PAYMENT_METHOD_LABELS = {
  CASH: "Dinheiro",
  CARD: "Cartão",
  PIX: "PIX",
  TRANSFER: "Transferência",
  CHECK: "Cheque",
  INSTALLMENT: "Parcelado",
} as const
