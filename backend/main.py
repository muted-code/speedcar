import os
import re
import math
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from dotenv import load_dotenv

# Configuración y variables de entorno
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

app = FastAPI(title="Speed Car Semantic Search API", version="1.0.0")

# Permitir CORS para conectar con el Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar Firebase Admin SDK si se cuenta con credenciales, de lo contrario fallback a mock
db = None
try:
    import firebase_admin
    from firebase_admin import credentials, firestore
    
    if os.path.exists("service-account.json"):
        cred = credentials.Certificate("service-account.json")
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Conectado exitosamente a Firebase Firestore.")
    else:
        # Intentar inicializar por defecto
        firebase_admin.initialize_app()
        db = firestore.client()
        print("Conectado exitosamente a Firebase Firestore (Default).")
except Exception as e:
    print(f"Firestore no inicializado (usando base de datos mock local): {e}")

# Base de Datos Mock como Fallback robusto
MOCK_VEHICULOS = [
    {
        "id": "1",
        "marca": "Mazda",
        "modelo": "CX-30 Grand Touring LX",
        "año": 2022,
        "precio": 111600000,
        "kilometraje": 29000,
        "placa_final": 1,
        "transmision": "Automático",
        "color": "Rojo Diamante",
        "descripcion_marketing": "Vehículo en perfecto estado, único dueño. Mantenimientos al día en concesionario autorizado Mazda. Diseño elegante y deportivo, ideal para la ciudad y carretera. Cuenta con tecnología de seguridad i-Activsense, sistema de audio premium Bose y techo corredizo. Aprovecha esta oportunidad única en el mercado caleño.",
        "urls_imagenes": [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1542282088-fe8426682b8f?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80",
        ],
        "destacado": True
    },
    {
        "id": "2",
        "marca": "Chevrolet",
        "modelo": "Tracker Turbo Premier",
        "año": 2021,
        "precio": 75500000,
        "kilometraje": 45000,
        "placa_final": 4,
        "transmision": "Automático",
        "color": "Gris Platino",
        "descripcion_marketing": "Excelente SUV familiar con motor turbo de alto rendimiento. Espaciosa, económica en consumo y con toda la tecnología que necesitas: pantalla táctil MyLink, cámara de reversa 360° y sensores de parqueo. Mantenimientos realizados en concesionario.",
        "urls_imagenes": [
            "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80",
        ],
        "destacado": True
    },
    {
        "id": "3",
        "marca": "Toyota",
        "modelo": "Corolla Cross",
        "año": 2023,
        "precio": 135000000,
        "kilometraje": 15000,
        "placa_final": 8,
        "transmision": "Automático",
        "color": "Blanco Perlado",
        "descripcion_marketing": "Como nueva. La confiabilidad de Toyota en un formato SUV moderno. Tecnología híbrida, sin restricción de pico y placa. Excelente rendimiento de combustible (18 km/l). Pantalla táctil, Apple CarPlay, sistema de seguridad Toyota Safety Sense de segunda generación.",
        "urls_imagenes": [
            "https://images.unsplash.com/photo-1626668893632-6f0a44733db9?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1619682817481-e994891cd1f5?auto=format&fit=crop&w=800&q=80",
        ],
        "destacado": True
    },
    {
        "id": "4",
        "marca": "Kia",
        "modelo": "Picanto Zenith",
        "año": 2020,
        "precio": 42000000,
        "kilometraje": 60000,
        "placa_final": 5,
        "transmision": "Mecánico",
        "color": "Plata Metálico",
        "descripcion_marketing": "Ideal para la ciudad. Muy económico, fácil de parquear. Mantenimientos económicos en red Kia. Perfecto como primer carro o vehículo secundario del hogar. Documentación al día, listo para traspaso inmediato.",
        "urls_imagenes": [
            "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=800&q=80",
        ],
        "destacado": False
    },
    {
        "id": "5",
        "marca": "Renault",
        "modelo": "Duster Intens 4x4",
        "año": 2021,
        "precio": 68900000,
        "kilometraje": 38000,
        "placa_final": 2,
        "transmision": "Mecánico",
        "color": "Naranja Atacama",
        "descripcion_marketing": "Aventura sin límites en la ciudad y fuera de ella. Motor 2.0L, tracción 4x4, gran distancia al suelo ideal para vías de Colombia. Interior espacioso con pantalla táctil Media Nav. Un vehículo que combina robustez y comodidad.",
        "urls_imagenes": [
            "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80",
        ],
        "destacado": False
    },
    {
        "id": "6",
        "marca": "Hyundai",
        "modelo": "Tucson Modern",
        "año": 2022,
        "precio": 98500000,
        "kilometraje": 22000,
        "placa_final": 9,
        "transmision": "Automático",
        "color": "Azul Esencia",
        "descripcion_marketing": "Diseño vanguardista y tecnología de punta. El Tucson 2022 es uno de los SUV más premiados de su segmento. Control de crucero adaptativo, frenado de emergencia autónomo y sistema BlueLink conectado. Un vehículo que eleva tu experiencia de manejo.",
        "urls_imagenes": [
            "https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80",
        ],
        "destacado": False
    }
]

class SearchRequest(BaseModel):
    query: str

def obtener_vehiculos() -> List[Dict[str, Any]]:
    """Obtiene vehículos de Firestore, o de mock si no hay conexión."""
    if db is None:
        return MOCK_VEHICULOS
    try:
        docs = db.collection("vehiculos").stream()
        res = []
        for doc in docs:
            d = doc.to_dict()
            d["id"] = doc.id
            res.append(d)
        if not res:
            return MOCK_VEHICULOS
        return res
    except Exception as e:
        print(f"Error leyendo de Firestore: {e}. Usando base de datos mock.")
        return MOCK_VEHICULOS

# --- NLP LOCAL: TF-IDF + Similitud de Coseno en Pure Python ---
STOP_WORDS = {"de", "la", "el", "que", "y", "en", "un", "una", "unos", "unas", "con", "para", "por", "es", "su", "sus", "al", "del", "o"}

def limpiar_y_tokenizar(texto: str) -> List[str]:
    """Tokeniza y limpia texto en español."""
    texto = texto.lower()
    # Eliminar caracteres especiales
    texto = re.sub(r"[^\w\s\d]", " ", texto)
    tokens = texto.split()
    return [t for t in tokens if t not in STOP_WORDS]

def calcular_similitud_tfidf(query: str, documentos: List[str]) -> List[float]:
    """Calcula similitud de coseno usando TF-IDF implementado de forma nativa."""
    query_tokens = limpiar_y_tokenizar(query)
    doc_tokens_list = [limpiar_y_tokenizar(doc) for doc in documentos]
    
    # Vocabulario de la consulta y documentos
    vocab = set(query_tokens)
    for doc_tokens in doc_tokens_list:
        vocab.update(doc_tokens)
    vocab = list(vocab)
    
    if not vocab or not query_tokens:
        return [0.0] * len(documentos)
        
    vocab_index = {word: i for i, word in enumerate(vocab)}
    
    # Calcular IDF
    n_docs = len(documentos)
    idf = {}
    for word in vocab:
        count = sum(1 for doc_tokens in doc_tokens_list if word in doc_tokens)
        # Añadir suavizado
        idf[word] = math.log((1 + n_docs) / (1 + count)) + 1
        
    # Vector query
    q_vector = [0.0] * len(vocab)
    for token in query_tokens:
        if token in vocab_index:
            q_vector[vocab_index[token]] += 1
    # Aplicar IDF al query
    for token in set(query_tokens):
        if token in vocab_index:
            idx = vocab_index[token]
            q_vector[idx] = q_vector[idx] * idf[token]
            
    # Vectores de documentos
    doc_vectors = []
    for doc_tokens in doc_tokens_list:
        d_vector = [0.0] * len(vocab)
        for token in doc_tokens:
            if token in vocab_index:
                d_vector[vocab_index[token]] += 1
        # Aplicar IDF
        for token in set(doc_tokens):
            if token in vocab_index:
                idx = vocab_index[token]
                d_vector[idx] = d_vector[idx] * idf[token]
        doc_vectors.append(d_vector)
        
    # Calcular Coseno
    def magnitude(vec):
        return math.sqrt(sum(x*x for x in vec))
        
    q_mag = magnitude(q_vector)
    if q_mag == 0:
        return [0.0] * len(documentos)
        
    scores = []
    for d_vec in doc_vectors:
        d_mag = magnitude(d_vec)
        if d_mag == 0:
            scores.append(0.0)
            continue
        dot = sum(q_vector[i] * d_vec[i] for i in range(len(vocab)))
        scores.append(dot / (q_mag * d_mag))
        
    return scores

# --- NLP CON EMBEDDINGS DE GEMINI (Opcional si hay API Key) ---
def obtener_embedding_gemini(texto: str, api_key: str) -> Optional[List[float]]:
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        data = {
            "model": "models/embedding-001",
            "content": {"parts": [{"text": texto}]}
        }
        res = requests.post(url, json=data, headers=headers, timeout=5)
        if res.status_code == 200:
            return res.json()["embedding"]["values"]
    except Exception as e:
        print(f"Error llamando a Gemini Embeddings API: {e}")
    return None

def similitud_coseno(v1: List[float], v2: List[float]) -> float:
    dot = sum(a*b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a*a for a in v1))
    mag2 = math.sqrt(sum(b*b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot / (mag1 * mag2)

# --- REGLAS HEURÍSTICAS ADICIONALES (Filtro Semántico Híbrido) ---
def parsear_restricciones_precio(query: str) -> Optional[Dict[str, float]]:
    """Extrae filtros de precio del lenguaje natural (ej: 'menos de 80 millones')."""
    query = query.lower()
    millones_match = re.findall(r"(\d+)\s*millones", query)
    num_match = re.findall(r"(\d+)\s*(?:000\s*000|m)", query)
    
    val = None
    if millones_match:
        val = float(millones_match[0]) * 1_000_000
    elif num_match:
        val = float(num_match[0]) * 1_000_000
        
    if val:
        if "menos de" in query or "bajo" in query or "máximo" in query or "hasta" in query or "menor a" in query or "<" in query:
            return {"operador": "menor", "valor": val}
        if "más de" in query or "mayor de" in query or "sobre" in query or "mínimo" in query or ">" in query:
            return {"operador": "mayor", "valor": val}
    return None

def parsear_transmision(query: str) -> Optional[str]:
    """Detecta la transmisión especificada."""
    query = query.lower()
    if "automat" in query or "aut " in query:
        return "Automático"
    if "mecanic" in query or "manual" in query:
        return "Mecánico"
    return None

@app.post("/api/search")
async def buscar_vehiculos(request: SearchRequest):
    query_str = request.query.strip()
    if not query_str:
        return obtener_vehiculos()
        
    vehiculos = obtener_vehiculos()
    
    # Preparar texto descriptivo de cada vehículo para vectorización
    documentos = []
    for v in vehiculos:
        detalles = f"{v['marca']} {v['modelo']} {v['año']} {v['color']} {v['transmision']} {v['descripcion_marketing']}"
        documentos.append(detalles)
        
    # Inicializar puntajes semánticos
    scores = []
    
    # Intentar usar Gemini si hay API Key, de lo contrario TF-IDF local
    usando_gemini = False
    if GEMINI_API_KEY:
        q_emb = obtener_embedding_gemini(query_str, GEMINI_API_KEY)
        if q_emb:
            doc_embs = []
            for doc in documentos:
                doc_embs.append(obtener_embedding_gemini(doc, GEMINI_API_KEY))
            
            # Si todos los embeddings se generaron correctamente
            if all(doc_embs):
                scores = [similitud_coseno(q_emb, d_emb) for d_emb in doc_embs]
                usando_gemini = True
                
    if not usando_gemini:
        # Fallback a TF-IDF en local (totalmente offline y rápido)
        scores = calcular_similitud_tfidf(query_str, documentos)
        
    # Aplicar heurísticas de precio y transmisión para potenciar la precisión
    filtro_precio = parsear_restricciones_precio(query_str)
    filtro_transmision = parsear_transmision(query_str)
    
    vehiculos_con_score = []
    for i, v in enumerate(vehiculos):
        score = scores[i]
        
        # Boost o penalización por precio
        if filtro_precio:
            if filtro_precio["operador"] == "menor" and v["precio"] <= filtro_precio["valor"]:
                score += 0.35  # Boost de relevancia
            elif filtro_precio["operador"] == "menor" and v["precio"] > filtro_precio["valor"]:
                score -= 0.50  # Fuerte penalización
            elif filtro_precio["operador"] == "mayor" and v["precio"] >= filtro_precio["valor"]:
                score += 0.35
            elif filtro_precio["operador"] == "mayor" and v["precio"] < filtro_precio["valor"]:
                score -= 0.50
                
        # Boost o penalización por transmisión
        if filtro_transmision:
            if v["transmision"].lower() == filtro_transmision.lower():
                score += 0.25
            else:
                score -= 0.40
                
        # Boost si busca marca directamente
        if v["marca"].lower() in query_str.lower():
            score += 0.20
            
        vehiculos_con_score.append((v, score))
        
    # Ordenar por puntaje descendente
    vehiculos_con_score.sort(key=lambda x: x[1], reverse=True)
    
    # Retornar resultados con una coincidencia razonable (score > 0.05 para evitar basura irrelevante)
    resultados = [v for v, score in vehiculos_con_score if score > 0.05]
    
    return resultados

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "using_gemini": bool(GEMINI_API_KEY), "using_firestore": db is not None}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
