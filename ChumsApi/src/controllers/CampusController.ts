import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Campus } from "../models"

@controller("/campuses")
export class CampusController extends CustomBaseController {

  @httpGet("/:id")
  public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.campus.load(id, au.churchId);
    });
  }

  @httpGet("/")
  public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      return await this.repositories.campus.loadAll(au.churchId);
    });
  }

  @httpPost("/")
  public async save(req: express.Request<{}, {}, Campus[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
      else {
        const promises: Promise<Campus>[] = [];
        req.body.forEach(campus => { if (campus.churchId === au.churchId) promises.push(this.repositories.campus.save(campus)); });
        const result = await Promise.all(promises);
        return this.json(result);
      }
    });
  }

  @httpDelete("/:id")
  public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
    return this.actionWrapper(req, res, async (au) => {
      if (!au.checkAccess("Services", "Edit")) return this.json({}, 401);
      else await this.repositories.campus.delete(id, au.churchId);
    });
  }

}
