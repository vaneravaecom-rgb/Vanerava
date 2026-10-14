
import 'dotenv/config';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const rl = readline.createInterface({ input, output });

async function main() {
  const email = (await rl.question('Correo del administrador: '))
    .trim()
    .toLowerCase();

  const username = (await rl.question('Nombre de usuario: ')).trim();
  const name = (await rl.question('Nombre: ')).trim();
  const lastName = (await rl.question('Apellido: ')).trim();
  const password = await rl.question('Contraseña nueva (mínimo 12 caracteres): ');

  if (!email || !username || !name || !lastName || password.length < 12) {
    throw new Error(
      'Completa todos los campos. La contraseña debe tener al menos 12 caracteres.',
    );
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('No se encontró MONGODB_URI en server/.env.');
  }

  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const db = client.db('offcorss');
    const users = db.collection('users');

    const existing = await users.findOne({ email });
    const passwordHash = await bcrypt.hash(password, 12);

    if (existing) {
      await users.updateOne(
        { _id: existing._id },
        {
          $set: {
            username,
            name,
            lastName,
            passwordHash,
            userType: 'Administrador',
          },
        },
      );

      console.log('Administrador actualizado correctamente.');
    } else {
      await users.insertOne({
        username,
        name,
        lastName,
        email,
        passwordHash,
        userType: 'Administrador',
        createDate: new Date().toISOString(),
      });

      console.log('Administrador creado correctamente.');
    }
  } finally {
    await client.close();
  }
}

main()
  .catch((error) => {
    console.error('No se pudo guardar el administrador:', error.message);
    process.exitCode = 1;
  })
  .finally(() => {
    rl.close();
  });
