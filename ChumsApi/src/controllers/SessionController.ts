import { controller, httpPost, httpGet, interfaces, requestParam, httpDelete } from "inversify-express-utils";
import express from "express";
import { CustomBaseController } from "./CustomBaseController"
import { Session } from "../models"

@controller("/sessions")
export class SessionController extends CustomBaseController {

    @httpGet("/:id")
    public async get(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Attendance", "View")) return this.json({}, 401);
            else return await this.repositories.session.load(id, au.churchId);
        });
    }

    @httpGet("/")
    public async getAll(req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Attendance", "View")) return this.json({}, 401);
            else return await this.repositories.session.loadAll(au.churchId);
        });
    }

    @httpPost("/")
    public async save(req: express.Request<{}, {}, Session[]>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Attendance", "Edit")) return this.json({}, 401);
            else {
                const promises: Promise<Session>[] = [];
                req.body.forEach(session => { if (session.churchId === au.churchId) promises.push(this.repositories.session.save(session)); });
                const result = await Promise.all(promises);
                return this.json(result);
            }
        });
    }

    @httpDelete("/:id")
    public async delete(@requestParam("id") id: number, req: express.Request<{}, {}, null>, res: express.Response): Promise<interfaces.IHttpActionResult> {
        return this.actionWrapper(req, res, async (au) => {
            if (!au.checkAccess("Donations", "Edit")) return this.json({}, 401);
            else await this.repositories.session.delete(id, au.churchId);
        });
    }

}
