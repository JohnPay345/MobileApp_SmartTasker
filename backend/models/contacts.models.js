export const ContactsModel = {
  getContactsByUserId: async (userId) => {
    try {
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model GetContactsByUserId" };
    }
  },
  createContact: async (userId) => {
    try {
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model CreateContact" };
    }
  },
  updateContact: async (userId) => {
    try {
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model UpdateContact" };
    }
  },
  deleteContact: async (userId) => {
    try {
      return { type: "result", result: result.rows };
    } catch (error) {
      return { type: "errorMsg", errorMsg: "Error in Model DeleteContact" };
    }
  }
}