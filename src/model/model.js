export const indexText = async (data) => {
  const sql = `SELECT * FROM portfolioText`;
  return (query = await data.query(sql));
};

export const indexImage = async (data) => {
  const sql = `SELECT * FROM portfolioImages`;
  return (query = await data.query(sql));
};

export const getPortfolioById = async (data, id) => {
  const sql = `SELECT * FROM portfolioText WHERE id == $id`;
  return (query = await data.query(sql, {
    $id: id,
  }));
};

export const getUserById = async (data, id) => {
  const sql = `SELECT username FROM portfolio WHERE id == $id`;
  return (query = await data.query(sql, {
    $id: id,
  }));
};

export const addUser = async (data, formData) => {
  const sql = `INSERT INTO user VALUES ($username, $passwort)`;
  const query = await data.query(sql, {
    $username: formData.username,
    $passwort: formData.passwort,
  });
};

/** db.queryEntries()
 * services Ordner mit DB importieren
 * folien persistenz
 */
