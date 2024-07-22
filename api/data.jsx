// pages/api/data.js

import { dataUser, dataAirdrop, dataReferral } from '../lib/data';

export default function handler(req, res) {
  res.status(200).json({ dataUser, dataAirdrop, dataReferral });
}
