// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowBuilder, WindowUrl};
use std::fs;
use std::path::PathBuf;

#[tauri::command]
fn get_app_data_dir(app_handle: tauri::AppHandle) -> Result<String, String> {
    match app_handle.path_resolver().app_data_dir() {
        Some(path) => Ok(path.to_string_lossy().to_string()),
        None => Err("Failed to get app data directory".to_string()),
    }
}

#[tauri::command]
fn create_backup(app_handle: tauri::AppHandle, backup_name: String) -> Result<String, String> {
    let app_data_dir = match app_handle.path_resolver().app_data_dir() {
        Some(path) => path,
        None => return Err("Failed to get app data directory".to_string()),
    };

    let backup_dir = app_data_dir.join("backups");
    if !backup_dir.exists() {
        fs::create_dir_all(&backup_dir).map_err(|e| e.to_string())?;
    }

    let backup_path = backup_dir.join(format!("{}.db", backup_name));
    let db_path = app_data_dir.join("multivus.db");

    if db_path.exists() {
        fs::copy(&db_path, &backup_path).map_err(|e| e.to_string())?;
        Ok(backup_path.to_string_lossy().to_string())
    } else {
        Err("Database file not found".to_string())
    }
}

#[tauri::command]
fn restore_backup(app_handle: tauri::AppHandle, backup_path: String) -> Result<(), String> {
    let app_data_dir = match app_handle.path_resolver().app_data_dir() {
        Some(path) => path,
        None => return Err("Failed to get app data directory".to_string()),
    };

    let db_path = app_data_dir.join("multivus.db");
    let backup_file = PathBuf::from(backup_path);

    if backup_file.exists() {
        fs::copy(&backup_file, &db_path).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("Backup file not found".to_string())
    }
}

#[tauri::command]
fn export_data(app_handle: tauri::AppHandle, export_path: String) -> Result<(), String> {
    let app_data_dir = match app_handle.path_resolver().app_data_dir() {
        Some(path) => path,
        None => return Err("Failed to get app data directory".to_string()),
    };

    let db_path = app_data_dir.join("multivus.db");
    let export_file = PathBuf::from(export_path);

    if db_path.exists() {
        fs::copy(&db_path, &export_file).map_err(|e| e.to_string())?;
        Ok(())
    } else {
        Err("Database file not found".to_string())
    }
}

fn main() {
    // Create menu
    let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    let close = CustomMenuItem::new("close".to_string(), "Close");
    let backup = CustomMenuItem::new("backup".to_string(), "Create Backup");
    let restore = CustomMenuItem::new("restore".to_string(), "Restore Backup");
    let export = CustomMenuItem::new("export".to_string(), "Export Data");
    let sync = CustomMenuItem::new("sync".to_string(), "Sync Now");

    let submenu = Submenu::new("File", Menu::new()
        .add_item(backup)
        .add_item(restore)
        .add_separator()
        .add_item(export)
        .add_separator()
        .add_item(sync)
        .add_separator()
        .add_item(close)
        .add_item(quit));

    let menu = Menu::new()
        .add_submenu(submenu)
        .add_native_item(MenuItem::Edit)
        .add_native_item(MenuItem::View)
        .add_native_item(MenuItem::Window);

    tauri::Builder::default()
        .menu(menu)
        .on_menu_event(|event| {
            match event.menu_item_id() {
                "quit" => {
                    std::process::exit(0);
                }
                "close" => {
                    event.window().close().unwrap();
                }
                "backup" => {
                    // Trigger backup dialog in frontend
                    event.window().emit("menu-backup", {}).unwrap();
                }
                "restore" => {
                    // Trigger restore dialog in frontend
                    event.window().emit("menu-restore", {}).unwrap();
                }
                "export" => {
                    // Trigger export dialog in frontend
                    event.window().emit("menu-export", {}).unwrap();
                }
                "sync" => {
                    // Trigger sync in frontend
                    event.window().emit("menu-sync", {}).unwrap();
                }
                _ => {}
            }
        })
        .invoke_handler(tauri::generate_handler![
            get_app_data_dir,
            create_backup,
            restore_backup,
            export_data
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
