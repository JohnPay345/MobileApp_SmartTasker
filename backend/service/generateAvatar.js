import { createAvatar } from '@dicebear/core';
import { initials } from "@dicebear/collection";
import fs from "fs";

export const generateAvatar = async (name, filePath) => {
  const avatar = createAvatar(initials, {
    seed: name,
    textColor: ['646f77'],
    backgroundColor: ['939ca3'],
    radius: 50
  });

  const svg = avatar.toString();
  fs.writeFile(filePath, svg);
}
