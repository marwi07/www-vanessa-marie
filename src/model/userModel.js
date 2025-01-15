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
  const sql = `SELECT userRole FROM user WHERE username = $name`;
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
  const sql = `SELECT * FROM userInfo WHERE user == $name`;
  const query = await db.query(sql, { $name: name });
  return query;
};

//delete
export const deleteUserInfoByUsername = async (db, username) => {
  const sql = `DELETE FROM userInfo WHERE user = $username`;
  const query = await db.query(sql, {
    $username: username,
  });
  return query;
};

//edit
export const updateUserInfoByUsername = async (db, username, formData) => {
  const data = {
    email: formData.get("email"),
    telefon: formData.get("telefon"),
    address: formData.get("address"),
    extra: formData.get("extra"),
    name: formData.get("name"),
  };

  const sql = `
    UPDATE userInfo 
    SET 
      email = $email,
      telephone = $telephone,
      text = $text,
      name = $name,
      address = $address
    WHERE user = $username
  `;
  const query = await db.query(sql, {
    $email: data.email,
    $telephone: data.telefon,
    $text: data.extra,
    $name: data.name,
    $address: data.address,
    $username: username,
  });
  return query;
};
