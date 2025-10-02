import dotenv from 'dotenv'

dotenv.config({quiet: true})

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`⚠️ Variável de ambiente obrigatória não definida: ${name}`);
  }
  return value;
}

export const globais = {
    DATABASE_SERVER: getEnvVar("DATABASE_SERVER"),
    DATABASE_NAME: getEnvVar("DATABASE_NAME"),
    DATABASE_USER: getEnvVar("DATABASE_USER"),
    DATABASE_PASSWORD: getEnvVar("DATABASE_PASSWORD"),
    CAMINHO_NFE: getEnvVar("CAMINHO_NFE"),
    CLIENT_ID: getEnvVar("CLIENT_ID"),
    CLIENT_SECRET: getEnvVar("CLIENT_SECRET"),
    REDIRECT_URI: getEnvVar("REDIRECT_URI")
}