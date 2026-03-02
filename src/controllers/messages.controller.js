const { StatusCodes } = require("http-status-codes");
const {chatService} = require("../services");

const getProjectMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { limit = 50, skip = 0 } = req.query;

    const messages = await chatService.getProjectMessages(
      projectId,
      Number(limit),
      Number(skip)
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: messages,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectMessages,
};