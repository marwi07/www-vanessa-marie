export const addWorkInfo = async (db, formData, username) => {
  const data = {
    title: formData.get("title"),
    text: formData.get("description"),
  };
  const sql = `INSERT INTO portfolioWorkText (title, text, username) VALUES ($title, $text, $username)`;
  const query = await db.query(sql, {
    $username: username,
    $title: data.title,
    $text: data.text,
  });
  return query;
};

export const addWorkImage = async (db, path, file, username, id) => {
  const data = {
    size: file.size,
    type: file.type,
    name: file.name,
  };
  const sql = `INSERT INTO portfolioWorkImage (username, path, size, type, name, textId) VALUES ($username,$path, $size, $type, $name, $id)`;

  const query = await db.query(sql, {
    $username: username,
    $size: data.size,
    $type: data.type,
    $name: data.name,
    $path: path,
    $id: id,
  });
  return query;
};

export const getIdByName = async (db, username) => {
  const sql = `SELECT id FROM portfolioWorkText WHERE username == $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

export const getImagesByName = async (db, id) => {
  const sql = `SELECT * FROM portfolioThumbnail WHERE textId == $id`;
  const query = await db.query(sql, {
    $id: id,
  });
  return query;
};

export const getWorkTextByName = async (db, username) => {
  const sql = `SELECT * FROM portfolioWorkText WHERE username == $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};
