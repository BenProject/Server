import { request, gql } from "graphql-request";
import config from "../../../config";
import { set, isEmpty } from "lodash";
import { JsonToArrayOfJson } from "../../../utils";
import { entitiesWrapper } from "../../bootstrapper";

export default {
  getPageCountByParams: async (req, res) => {
    const { entitiesPerPage, params } = req.body;

    if (!params || !entitiesPerPage|| isEmpty(params)) {
      res.status(400);
      return res.send("didnt provided all must be args");
    }

    try {
      res.send({
        pageCount: await entitiesWrapper.getPageCountByParams(
          params,
          entitiesPerPage
        ),
      });
    } catch (err) {
      res.status(500);
      res.send(`error while trying to getPageCountByParams, err: ${err}`);
    }
  },

  getEntitiesByParams: async (req, res) => {
    const { pageNumber, entitiesPerPage, params } = req.body;

    if (!params || !entitiesPerPage || !pageNumber || isEmpty(params)) {
      res.status(400);
      return res.send("didnt provided all must be args");
    }
    try {
      res.send(
        await entitiesWrapper.getEntitiesByParams(
          params,
          entitiesPerPage,
          pageNumber
        )
      );
    } catch (err) {
      res.status(500);
      res.send(`error while trying to getEntitiesByParams, err: ${err}`);
    }
  },
};
