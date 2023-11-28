const { resource } = require("./resource");

const scoreboardResource = (data) => {
    return resource(data, (data) => {
        const result = {
            id: data._id,
            admiss_id: data.admiss_id,
            activi_id: data.activi_id,
            sco_start: data.sco_start,
            sco_end: data.sco_end,
            sco_score: data.sco_score,
            sco_win: data.sco_win,
            sco_resume: data.sco_resume,
            updatedAt: data.updatedAt,
            createdAt: data.createdAt
        };
        return result;
    });
}

module.exports = { scoreboardResource };