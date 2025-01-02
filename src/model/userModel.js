export const getUserById = async (db, id) => {
  const sql = `SELECT username FROM portfolio WHERE id = $id`;
  return await db.query(sql, { $id: id });
};

export const addUser = async (db, username, passwort, userRole) => {
  const sql = `INSERT INTO user (username, passwort, userRole) VALUES ($username, $passwort, $role)`;
  return await db.query(sql, {
    $username: username,
    $passwort: passwort,
    $role: userRole,
  });
};

export const getUserByName = async (db, name) => {
  const sql = `SELECT username FROM user WHERE username = $name`;
  const query = await db.query(sql, { $name: name });
  return query;
};

export const getPasswortByUser = async (db, name) => {
  const sql = `SELECT passwort FROM user WHERE username = $name`;
  const query = await db.query(sql, { $name: name });
  return query;
};

export const getRoleByUser = async (db, name) => {
  const sql = `SELECT role FROM user WHERE username = $name`;
  const query = await db.query(sql, { $name: name });
  return query;
};

export const addUserInfo = async (db, formData, username) => {
  const data = {
    email: formData.get("email"),
    telefon: formData.get("telefon"),
    address: formData.get("address"),
    extra: formData.get("extra"),
    name: formData.get("name"),
  };
  const sql = `INSERT INTO userInfo (email, telephone, text, name, user, address) VALUES ($email, $telephone, $text, $name, $user, $address)`;
  return await db.query(sql, {
    $email: data.email,
    $telephone: data.telefon,
    $text: data.extra,
    $name: data.name,
    $user: username,
    $address: data.address,
  });
};

export const getInfoByUser = async (db, name) => {
  const sql = `SELECT * FROM userInfo WHERE user = $name`;
  const query = await db.query(sql, { $name: name });
  return query;
};
