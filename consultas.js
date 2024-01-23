import pkg from 'pg';
const { Pool } = pkg;

import bcrypt from 'bcryptjs';

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '',
    database: 'softjobs',
    allowExitOnIdle: true
});

// Obtener usuarios
const getUsers = async () => {
    console.log('Dentro de la función getUsers...');
    const { rows: users } = await pool.query('SELECT * FROM usuarios');
    return users;
}

const getUserById = async (id) => {
    const query = 'SELECT * FROM usuarios WHERE id = $1';
    const values = [id];
    const result = await pool.query(query, values);
    const [user] = result.rows;
    return user;
}

// Verificar credenciales
const checkCredentials = async (email, password) => {
    const values = [email];
    const query = "SELECT * FROM usuarios WHERE email = $1";

    const { rows: [user], rowCount } = await pool.query(query, values);

    const { password: hashedPassword } = user;
    const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword);

    if (!isPasswordCorrect || !rowCount)
        throw { code: 401, message: "Email o contraseña incorrecta" };
}

// Registrar nuevo usuario
const registerUser = async (user) => {
    try {
        const { email, password, rol, lenguage } = user;
        const hashedPassword = bcrypt.hashSync(password); // encriptat contraseña

        const values = [email, hashedPassword, rol, lenguage];
        const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4)';
        await pool.query(query, values);

        console.log('Usuario registrado con éxito');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        throw error;
    }
};

export { getUsers, getUserById, checkCredentials, registerUser };
