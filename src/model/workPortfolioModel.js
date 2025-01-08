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

export const getImagesById = async (db, id) => {
  const sql = `SELECT * FROM portfolioWorkImage WHERE textId == $id`;
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

//delete
export const deleteWorkTextById = async (db, id) => {
  const sql = `DELETE FROM portfolioWorkText WHERE id = $id`;
  const query = await db.query(sql, {
    $id: id,
  });
  return query;
};

export const deleteWorkImageById = async (db, id) => {
  const sql = `DELETE FROM portfolioWorkImage WHERE id = $id`;
  const query = await db.query(sql, {
    $id: id,
  });
  return query;
};

export const deleteImagesByTextId = async (db, textId) => {
  const sql = `DELETE FROM portfolioWorkImage WHERE textId = $textId`;
  const query = await db.query(sql, {
    $textId: textId,
  });
  return query;
};

export const deleteWorkTextByUsername = async (db, username) => {
  const sql = `DELETE FROM portfolioWorkText WHERE username = $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

//edit
export const updateWorkTextById = async (db, id, formData) => {
  const data = {
    title: formData.get("title"),
    text: formData.get("description"),
  };

  const sql = `
    UPDATE portfolioWorkText 
    SET 
      title = $title,
      text = $text
    WHERE id = $id
  `;
  const query = await db.query(sql, {
    $id: id,
    $title: data.title,
    $text: data.text,
  });
  return query;
};

export const updateWorkImageById = async (db, id, path, file) => {
  const data = {
    size: file.size,
    type: file.type,
    name: file.name,
  };

  const sql = `
    UPDATE portfolioWorkImage 
    SET 
      path = $path,
      size = $size,
      type = $type,
      name = $name
    WHERE id = $id
  `;
  const query = await db.query(sql, {
    $id: id,
    $path: path,
    $size: data.size,
    $type: data.type,
    $name: data.name,
  });
  return query;
};
