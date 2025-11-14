# Instrucciones para hacer Commit y Push

## Opción 1: Usando Git desde la terminal (si Git está instalado)

Si tienes Git instalado, ejecuta estos comandos en la raíz del proyecto:

```bash
# 1. Verificar estado
git status

# 2. Agregar todos los archivos
git add .

# 3. Hacer commit
git commit -m "Initial skeleton setup - Backend and UI architecture"

# 4. Agregar remote (si aún no lo has hecho)
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# 5. Push al repositorio
git push -u origin main
```

## Opción 2: Usando VS Code

1. Abre VS Code en la carpeta del proyecto
2. Ve a la pestaña "Source Control" (Ctrl+Shift+G)
3. Haz clic en "Stage All Changes"
4. Escribe el mensaje: `Initial skeleton setup - Backend and UI architecture`
5. Haz clic en "Commit"
6. Haz clic en "Sync Changes" o "Push"

## Opción 3: Usando GitHub Desktop

1. Abre GitHub Desktop
2. Abre este repositorio
3. Escribe el mensaje: `Initial skeleton setup - Backend and UI architecture`
4. Haz clic en "Commit to main"
5. Haz clic en "Push origin"

## Mensaje sugerido para el commit:

```
Initial skeleton setup - Backend and UI architecture
```

O más corto:
```
Skeleton setup
```

