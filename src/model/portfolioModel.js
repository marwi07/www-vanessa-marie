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

export const addPortfolioInfo = async (db, formData) => {
  const data = {
    title: formData.get("title"),
    about: formData.get("about"),
    skills: formData.get("skills"),
  };
  const sql = `INSERT INTO portfolioText (title, text, skills) VALUES ($title, $about, $skills)`;
  return await db.query(sql, {
    $title: data.title,
    $about: data.about,
    $skills: data.skills,
  });
};

export const addPortfolioUser = async (db, username) => {
  const sql = `INSERT INTO portfolio (username) VALUES ($username)`;
  return await db.query(sql, {
    $username: username,
  });
};

export const addPortfolioThumbnail = async (db, path, file) => {
  const data = {
    size: file.size,
    type: file.type,
    name: file.name,
  };
  const sql = `INSERT INTO portfolioThumbnail (path, size, type, name) VALUES ($path, $size, $type, $name)`;

  return await db.query(sql, {
    $size: data.size,
    $type: data.type,
    $name: data.name,
    $path: path,
  });
};
