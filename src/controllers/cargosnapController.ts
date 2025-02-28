import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import FormData from "form-data";
import fs from "fs";

dotenv.config();

const CARGOSNAP_API_URL = "https://api.cargosnap.com/api/v2/";
const API_TOKEN = process.env.CARGOSNAP_API_KEY;

/**
 * @api {post} /files Criar Arquivo
 * @apiName SetFiles
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiBody {String} reference Referência única do arquivo (máx. 255 caracteres).
 * @apiBody {Boolean} [close=false] Se a referência deve ser fechada após o upload.
 * @apiBody {String} [location] Localização opcional do arquivo.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Dados retornados pelo CargoSnap.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "fileId": "123456",
 *        "status": "uploaded"
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Erro de Validação:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "Invalid reference provided"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const setFiles = async (req: Request, res: Response) => {
  try {
    const { reference, close = "false", location } = req.body;

    if (!reference || typeof reference !== "string" || reference.length > 255) {
      return res.status(400).json({ response: "failed", status: "Invalid reference provided" });
    }

    const params = new URLSearchParams({
      token: API_TOKEN!,
      reference,
      close: close.toString(),
    });

    if (location) {
      params.append("location", location.toString());
    }

    const response = await axios.post(`${CARGOSNAP_API_URL}/files?${params.toString()}`);
    return res.json(response.data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ response: "failed", status: "Internal server error" });
  }
};

/**
 * @api {get} /files Listar Arquivos
 * @apiName GetFiles
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} [reference] Referência única do arquivo (máx. 255 caracteres).
 * @apiQuery {Boolean} [closed=false] Se a referência deve ser fechada após o upload.
 * @apiQuery {String} [find] Termo de busca.
 * @apiQuery {String} [startdate] Data inicial para busca.
 * @apiQuery {String} [enddate] Data final para busca.
 * @apiQuery {String} [updated_start] Data de início da última atualização.
 * @apiQuery {String} [updated_end] Data de fim da última atualização.
 * @apiQuery {Number} [limit] Número máximo de registros retornados.
 * @apiQuery {String} [include] Informações adicionais a serem incluídas.
 * @apiQuery {String} [field_id] ID do campo específico.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object[]} data Lista de arquivos encontrados.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": [
 *        {
 *          "fileId": "123456",
 *          "status": "uploaded"
 *        },
 *        {
 *          "fileId": "789012",
 *          "status": "processed"
 *        }
 *      ]
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Erro de Validação:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "Invalid parameters provided"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const getFiles = async (req: Request, res: Response) => {
  try {
    const {
      reference,
      find,
      closed,
      startdate,
      enddate,
      updated_start,
      updated_end,
      limit,
      include,
      field_id,
    } = req.body;

    const filteredParams: any = {};
    Object.entries(req.body).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        filteredParams[key] = value;
      }
    });

    const params = new URLSearchParams({
      token: API_TOKEN,
      ...filteredParams,
    });

    const response = await axios.get(`${CARGOSNAP_API_URL}/files?${params.toString()}`);
    res.json(response.data.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {get} /files/:id Obter Arquivo por ID
 * @apiName GetFileById
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiParam {String} id ID único do arquivo.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Dados do arquivo encontrado.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "fileId": "123456",
 *        "status": "uploaded",
 *        "createdAt": "2024-02-28T12:00:00Z",
 *        "updatedAt": "2024-02-28T12:30:00Z"
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Arquivo Não Encontrado:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "response": "failed",
 *      "status": "File not found"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const getFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.get(`${CARGOSNAP_API_URL}/files/${id}?${params.toString()}`);
    res.json(response.data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @api {patch} /files/:id/close Fechar Arquivo por ID
 * @apiName CloseFileById
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiParam {String} id ID único do arquivo a ser fechado.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Dados do arquivo atualizado.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "fileId": "123456",
 *        "status": "closed",
 *        "closedAt": "2024-02-28T13:00:00Z"
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Arquivo Não Encontrado:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "response": "failed",
 *      "status": "File not found"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const closeFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "O ID do arquivo é obrigatório." });

    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.patch(
      `${CARGOSNAP_API_URL}/files/${id}/close?${params.toString()}`, // Adicionando o token na URL
      {}
    );

    res.json(response.data);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @api {delete} /files/:id Deletar Arquivo por ID
 * @apiName DeleteFileById
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiParam {String} id ID único do arquivo a ser deletado.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {String} message Mensagem de sucesso.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "message": "Arquivo deletado com sucesso."
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Arquivo Não Encontrado:
 *    HTTP/1.1 404 Not Found
 *    {
 *      "response": "failed",
 *      "status": "File not found or already deleted"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const deleteFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "O ID do arquivo é obrigatório." });
    }

    const params = new URLSearchParams({
      token: API_TOKEN!,
    });

    const response = await axios.delete(`${CARGOSNAP_API_URL}/files/${id}?${params.toString()}`);

    if (!response.data || Object.keys(response.data).length === 0) {
      return res.status(404).json({ message: "Arquivo não encontrado ou já deletado." });
    }

    res.json({ message: "Arquivo deletado com sucesso.", data: response.data });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

/**
 * @api {post} /uploads Enviar Arquivos para CargoSnap
 * @apiName UploadFiles
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiBody {String} reference Referência única do arquivo (máx. 255 caracteres).
 * @apiBody {Boolean} [include_in_share=false] Indica se o arquivo deve ser incluído em compartilhamentos.
 * @apiBody {String} [location] Localização opcional do arquivo.
 * @apiBody {File[]} uploads[] Lista de arquivos a serem enviados.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Dados retornados pelo CargoSnap.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "files": [
 *          {
 *            "fileId": "123456",
 *            "status": "uploaded"
 *          },
 *          {
 *            "fileId": "789012",
 *            "status": "uploaded"
 *          }
 *        ]
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Erro de Referência Inválida:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "Invalid reference provided"
 *    }
 *
 * @apiErrorExample {json} Nenhum Arquivo Enviado:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "No files uploaded"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const uploadsFiles = async (req: Request, res: Response) => {
  try {
    const { reference, include_in_share = "false", location } = req.body;
    const files = req.files as Express.Multer.File[];

    if (!reference || typeof reference !== "string" || reference.length > 255) {
      return res.status(400).json({ response: "failed", status: "Invalid reference provided" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ response: "failed", status: "No files uploaded" });
    }

    const formData = new FormData();
    formData.append("reference", reference);
    formData.append("include_in_share", include_in_share.toString());

    if (location) {
      formData.append("location", location.toString());
    }

    for (const file of files) {
      formData.append("uploads[]", fs.createReadStream(file.path), file.originalname);
    }

    const response = await axios.post(`${CARGOSNAP_API_URL}/uploads?token=${API_TOKEN}`, formData, {
      headers: formData.getHeaders(),
    });

    return res.json(response.data);
  } catch (error: any) {
    return res.status(500).json({ response: "failed", status: "Internal server error" });
  }
};

/**
 * @api {post} /fields/:reference Adicionar Campos a um Arquivo
 * @apiName AddFieldsToFile
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiParam {String} reference Referência única do arquivo.
 *
 * @apiBody {Object[]} fields Lista de campos a serem adicionados ao arquivo.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Dados atualizados do arquivo.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "reference": "ABC123",
 *        "fields": [
 *          {
 *            "name": "Categoria",
 *            "value": "Documentos"
 *          },
 *          {
 *            "name": "Prioridade",
 *            "value": "Alta"
 *          }
 *        ]
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Referência Obrigatória:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "O campo referência é obrigatório."
 *    }
 *
 * @apiErrorExample {json} Campos Inválidos:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "Os campos são obrigatórios e devem estar em um array."
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Internal server error"
 *    }
 */
/*✅*/ export const fieldsFiles = async (req: Request, res: Response) => {
  try {
    const { reference, fields } = req.body;

    if (!reference) {
      return res.status(400).json({ message: "O campo referência é obrigatório." });
    }

    if (!Array.isArray(fields) || fields.length === 0) {
      return res.status(400).json({ message: "Os campos são obrigatórios e devem estar em um array." });
    }

    const response = await axios.post(
      `${CARGOSNAP_API_URL}/fields/${reference}?token=${API_TOKEN}`,
      fields,
      { headers: { "Content-Type": "application/json" } }
    );

    res.json(response.data);
  } catch (error: any) {
    return res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
};

/**
 * @api {post} /reports Gerar Relatório de Arquivos
 * @apiName GenerateFileReport
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiBody {String[]} files Lista de IDs de arquivos a serem incluídos no relatório.
 * @apiBody {String} [template] Nome do template a ser utilizado no relatório.
 * @apiBody {String} [filename] Nome do arquivo de saída do relatório.
 * @apiBody {Boolean} [asynchronous=false] Indica se o relatório deve ser gerado de forma assíncrona.
 * @apiBody {Object} [settings] Configurações adicionais para a geração do relatório.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Informações do relatório gerado.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 201 Created
 *    {
 *      "response": "success",
 *      "data": {
 *        "reportId": "REP-987654",
 *        "status": "processing"
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Lista de Arquivos Obrigatória:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "O campo 'files' é obrigatório e deve ser um array!"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Erro interno no servidor"
 *    }
 */
/*✅*/ export const reportsFiles = async (req: Request, res: Response) => {
  try {
    const { files, template, filename, settings, asynchronous } = req.body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return res.status(400).json({ error: "O campo 'files' é obrigatório e deve ser um array!" });
    }

    const requestData = {
      files,
      ...(template && { template }),
      ...(filename && { filename }),
      ...(asynchronous !== undefined && { asynchronous }),
      ...(settings && { settings }),
    };

    const response = await axios.post(
      `${CARGOSNAP_API_URL}/reports?token=${API_TOKEN}`,
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json(response.data);
  } catch (error: any) {
    console.error("Erro ao gerar relatório:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || "Erro interno no servidor" });
  }
};

/**
 * @api {get} /share Gerar Link de Compartilhamento
 * @apiName ShareFile
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiQuery {String} reference Referência única do arquivo a ser compartilhado.
 * @apiQuery {String} [expires] Data de expiração do link no formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ).
 * @apiQuery {String} [language] Idioma do link de compartilhamento (ex.: "en", "pt").
 * @apiQuery {Boolean} [dl=false] Define se o link deve permitir download direto.
 * @apiQuery {String} [email] Endereço de e-mail para envio do link de compartilhamento.
 * @apiQuery {Boolean} [send_email=false] Define se o link deve ser enviado por e-mail.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Informações do link de compartilhamento.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "shareUrl": "https://cargosnap.com/share/ABC123",
 *        "expires": "2024-03-10T23:59:59Z"
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} Referência Obrigatória:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "O campo reference é obrigatório!"
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Erro interno no servidor"
 *    }
 */
/*✅*/ export const shareFiles = async (req: Request, res: Response) => {
  try {
    const { reference, expires, language, dl, email, send_email } = req.body;
    if (!reference) {
      return res.status(400).json({ error: "O campo reference é obrigatório!" });
    }

    const params = new URLSearchParams({
      token: API_TOKEN!,
      reference,
      ...(expires && { expires: new Date(expires).toISOString() }),
      ...(language && { language }),
      ...(dl !== undefined ? { dl: String(dl) } : {}),
      ...(email && { email }),
      ...(send_email !== undefined ? { send_email: String(send_email) } : {}),
    });

    const response = await axios.get(`${CARGOSNAP_API_URL}/share?${params.toString()}`);

    res.json(response.data);
  } catch (error: any) {
    res.status(error.response?.status || 500).json({ error: error.response?.data || error.message });
  }
};

/**
 * @api {get} /forms/:id Buscar Formulário por ID
 * @apiName GetFormById
 * @apiGroup CargoSnap
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} id ID único do formulário.
 *
 * @apiQuery {String} [reference] Referência do formulário.
 * @apiQuery {String} [startdate] Data de criação inicial do formulário (ISO 8601).
 * @apiQuery {String} [enddate] Data de criação final do formulário (ISO 8601).
 * @apiQuery {String} [updated_start] Data inicial de atualização do formulário (ISO 8601).
 * @apiQuery {String} [updated_end] Data final de atualização do formulário (ISO 8601).
 * @apiQuery {Number} [limit] Número máximo de resultados retornados.
 *
 * @apiSuccess {String} response Status da requisição.
 * @apiSuccess {Object} data Dados do formulário solicitado.
 *
 * @apiSuccessExample {json} Exemplo de Resposta:
 *    HTTP/1.1 200 OK
 *    {
 *      "response": "success",
 *      "data": {
 *        "id": 123,
 *        "reference": "REF-456",
 *        "created_at": "2024-02-28T10:00:00Z",
 *        "updated_at": "2024-02-29T12:00:00Z",
 *        "fields": [
 *          { "name": "Categoria", "value": "Relatório" },
 *          { "name": "Status", "value": "Concluído" }
 *        ]
 *      }
 *    }
 *
 * @apiError {String} response Indica que a requisição falhou.
 * @apiError {String} status Mensagem de erro.
 *
 * @apiErrorExample {json} ID Inválido:
 *    HTTP/1.1 400 Bad Request
 *    {
 *      "response": "failed",
 *      "status": "O ID do formulário é obrigatório e deve ser um número válido."
 *    }
 *
 * @apiErrorExample {json} Erro de Autenticação:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "API_TOKEN não está configurado."
 *    }
 *
 * @apiErrorExample {json} Erro do Servidor:
 *    HTTP/1.1 500 Internal Server Error
 *    {
 *      "response": "failed",
 *      "status": "Erro interno do servidor ao buscar o formulário."
 *    }
 */
/*✅*/ export const formsFilesById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "O ID do formulário é obrigatório e deve ser um número válido." });
    }

    if (!API_TOKEN) {
      return res.status(500).json({ error: "API_TOKEN não está configurado." });
    }

    const { reference, startdate, enddate, updated_start, updated_end, limit } = req.query;

    const params = new URLSearchParams({ token: API_TOKEN });

    if (reference) params.append("reference", String(reference));
    if (startdate) params.append("startdate", String(startdate));
    if (enddate) params.append("enddate", String(enddate));
    if (updated_start) params.append("updated_start", String(updated_start));
    if (updated_end) params.append("updated_end", String(updated_end));
    if (limit) params.append("limit", String(limit));

    const response = await axios.get(`${CARGOSNAP_API_URL}/forms/${id}?${params.toString()}`);

    return res.json(response.data.data);
  } catch (error: any) {
    console.error("Erro ao buscar formulário:", error.message);
    return res.status(500).json({ error: "Erro interno do servidor ao buscar o formulário." });
  }
};