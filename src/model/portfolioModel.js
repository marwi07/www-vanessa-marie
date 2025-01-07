export const indexText = async (db) => {
  const sql = `SELECT * FROM portfolioText`;
  const query = await db.query(sql);
  return query;
};

export const indexImage = async (db) => {
  const sql = `SELECT * FROM portfolioImages`;
  const query = await db.query(sql);
  return query;
};

export const addPortfolioInfo = async (
  db,
  formData,
  skills,
  tags,
  username
) => {
  const data = {
    title: formData.get("title"),
    about: formData.get("about"),
    skills: skills,
    tags: tags,
    description: formData.get("description"),
  };
  const sql = `INSERT INTO portfolioText (username, title, text, skills, description, tags) VALUES ($username, $title, $about, $skills, $description, $tags)`;
  const query = await db.query(sql, {
    $username: username,
    $title: data.title,
    $about: data.about,
    $skills: data.skills,
    $description: data.description,
    $tags: data.tags,
  });
  return query;
};

export const addPortfolioUser = async (db, username) => {
  const sql = `INSERT INTO portfolio (username) VALUES ($username)`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

export const addPortfolioThumbnail = async (db, path, file, username) => {
  const data = {
    size: file.size,
    type: file.type,
    name: file.name,
  };
  const sql = `INSERT INTO portfolioThumbnail (username, path, size, type, name) VALUES ($username,$path, $size, $type, $name)`;

  const query = await db.query(sql, {
    $username: username,
    $size: data.size,
    $type: data.type,
    $name: data.name,
    $path: path,
  });
  return query;
};

export const getIdByName = async (db, username) => {
  const sql = `SELECT id FROM portfolio WHERE username == $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

export const getThumbnailByName = async (db, username) => {
  const sql = `SELECT * FROM portfolioThumbnail WHERE username == $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

export const getPortfolioByName = async (db, username) => {
  const sql = `SELECT * FROM portfolioText WHERE username == $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};
