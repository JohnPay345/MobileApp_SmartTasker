import { errorReplyCodes } from "../service/duplicatePartsCode.js";
import { ContactsModel } from "../models/contacts.models.js";

export const ContactsController = {
  GetContactsByUserId: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, message: "Success!" });
    } catch (error) {
      console.error("Error at get contacts by user id", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  CreateContacts: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, message: "Success!" });
    } catch (error) {
      console.error("Error at create contact", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  UpdateContact: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, message: "Success!" });
    } catch (error) {
      console.error("Error at update contact", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
  DeleteContact: async (req, rep) => {
    try {
      return rep.code(200).send({ code: 200, url: req.url, message: "Success!" });
    } catch (error) {
      console.error("Error at delete contacts", error);
      return errorReplyCodes.reply500("DEFAULT");
    }
  },
}