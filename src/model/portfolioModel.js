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

//add data
export const addPortfolioInfo = async (
  db,
  title,
  about,
  description,
  skills,
  tags,
  username
) => {
  const sql = `INSERT INTO portfolioText (username, title, text, skills, description, tags) VALUES ($username, $title, $about, $skills, $description, $tags)`;
  const query = await db.query(sql, {
    $username: username,
    $title: title,
    $about: about,
    $skills: skills,
    $description: description,
    $tags: tags,
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

//delete
export const deletePortfolioTextByName = async (db, username) => {
  const sql = `DELETE FROM portfolioText WHERE username = $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

export const deletePortfolioThumbnailByName = async (db, username) => {
  const sql = `DELETE FROM portfolioThumbnail WHERE username = $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

//Edit
export const updatePortfolioText = async (
  db,
  title,
  about,
  description,
  skills,
  tags,
  username
) => {
  const sql = `
    UPDATE portfolioText 
    SET 
      title = $title,
      text = $about,
      skills = $skills,
      description = $description,
      tags = $tags
    WHERE username = $username
  `;
  const query = await db.query(sql, {
    $username: username,
    $title: title,
    $about: about,
    $skills: skills,
    $description: description,
    $tags: tags,
  });
  return query;
};

export const updatePortfolioThumbnail = async (db, username, path, file) => {
  const data = {
    size: file.size,
    type: file.type,
    name: file.name,
  };

  const sql = `
    UPDATE portfolioThumbnail 
    SET 
      path = $path,
      size = $size,
      type = $type,
      name = $name
    WHERE username = $username
  `;
  const query = await db.query(sql, {
    $username: username,
    $path: path,
    $size: data.size,
    $type: data.type,
    $name: data.name,
  });
  return query;
};
