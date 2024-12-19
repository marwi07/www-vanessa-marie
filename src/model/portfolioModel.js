export const indexText = async (db) => {
  const sql = `SELECT * FROM portfolioText`;
  return (query = await db.queryEntries(sql));
};

export const indexImage = async (db) => {
  const sql = `SELECT * FROM portfolioImages`;
  return (query = await db.queryEntries(sql));
};

export const getPortfolioById = async (db, id) => {
  const sql = `SELECT * FROM portfolioText WHERE id == $id`;
  return (query = await db.queryEntries(sql, {
    $id: id,
  }));
};
