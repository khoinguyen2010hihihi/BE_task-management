import { Request, Response } from "express";
import boardService from "../services/board.service";

class BoardController {
  async getAll(req: Request, res: Response) {
    try {
      const data = await boardService.getAll();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const data = await boardService.getById(id);
      res.json(data);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, workspace_id, cover_url } = req.body;
      const data = await boardService.createBoard(
        name,
        workspace_id,
        cover_url
      );
      res.status(201).json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, cover_url } = req.body;
      const data = await boardService.updateBoard(id, name, cover_url);
      res.json(data);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await boardService.deleteBoard(id);
      res.json({ message: "Board deleted successfully" });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default new BoardController();
