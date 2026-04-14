import argon2 from "argon2";

export const hashPassword = async (password) => {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB. this is the memory for 1 simultaneous user
    timeCost: 3, // Number of iterations
    parallelism: 1, // Number of threads
  });
};

export const verifyPassword = async (password, hash) => {
  return await argon2.verify(hash, password);
};
