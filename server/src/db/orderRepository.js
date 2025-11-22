const { randomUUID } = require('crypto');
const { initDatabase, run, get, all } = require('./index');
async function createOrder(payload) {
  await initDatabase();

  const id = payload.id || randomUUID();
  const timestamp = new Date().toISOString();

  run(
    `
    INSERT INTO orders (
      id,
      customer_name,
      email,
      phone,
      address,
      total,
      currency,
      status,
      payment_method,
      payment_channel,
      payment_link_id,
      payment_url,
      items,
      metadata,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `,
    [
      id,
      payload.customerName,
      payload.email,
      payload.phone,
      payload.address,
      payload.total,
      payload.currency || 'PHP',
      payload.status || 'pending',
      payload.paymentMethod || null,
      payload.paymentChannel || null,
      payload.paymentLinkId || null,
      payload.paymentUrl || null,
      JSON.stringify(payload.items || []),
      JSON.stringify(payload.metadata || {}),
      timestamp,
      timestamp,
    ],
  );

  console.log('Created order with values:', {
    id,
    customerName: payload.customerName,
    email: payload.email,
    phone: payload.phone,
    address: payload.address,
    total: payload.total,
    currency: payload.currency || 'PHP',
    status: payload.status || 'pending',
    paymentMethod: payload.paymentMethod,
    paymentChannel: payload.paymentChannel,
    paymentLinkId: payload.paymentLinkId,
    paymentUrl: payload.paymentUrl,
    items: payload.items,
    metadata: payload.metadata,
    createdAt: timestamp,
    updatedAt: timestamp,
  });

  return getOrderById(id);
}

async function updateOrder(id, changes = {}) {
  await initDatabase();
  const existing = await getOrderById(id);
  if (!existing) return null;

  const serializedItems = changes.items
    ? JSON.stringify(changes.items)
    : JSON.stringify(existing.items || []);

  const serializedMetadata = changes.metadata
    ? JSON.stringify(changes.metadata)
    : JSON.stringify(existing.metadata || {});

  const next = {
    ...existing,
    ...changes,
    updatedAt: new Date().toISOString(),  // camelCase
  };

  // Helper to convert undefined to null
  const safeValue = (v) => (v === undefined ? null : v);

  // Log if any undefined values exist
  for (const [key, val] of Object.entries({
    customerName: next.customerName,
    email: next.email,
    phone: next.phone,
    address: next.address,
    total: next.total,
    currency: next.currency,
    status: next.status,
    paymentMethod: next.paymentMethod,
    paymentChannel: next.paymentChannel,
    paymentLinkId: next.paymentLinkId,
    paymentUrl: next.paymentUrl,
    items: serializedItems,
    metadata: serializedMetadata,
    updatedAt: next.updatedAt,
    id,
  })) {
    if (val === undefined) {
      console.error(`ERROR: Value for ${key} is undefined! This will cause SQLite to fail.`);
    }
  }

  // Run the update query, replacing undefined with null
  run(
    `
    UPDATE orders SET
      customer_name = ?,
      email = ?,
      phone = ?,
      address = ?,
      total = ?,
      currency = ?,
      status = ?,
      payment_method = ?,
      payment_channel = ?,
      payment_link_id = ?,
      payment_url = ?,
      items = ?,
      metadata = ?,
      updated_at = ?
    WHERE id = ?
  `,
    [
      safeValue(next.customerName),
      safeValue(next.email),
      safeValue(next.phone),
      safeValue(next.address),
      safeValue(next.total),
      safeValue(next.currency),
      safeValue(next.status),
      safeValue(next.paymentMethod),
      safeValue(next.paymentChannel),
      safeValue(next.paymentLinkId),
      safeValue(next.paymentUrl),
      safeValue(serializedItems),
      safeValue(serializedMetadata),
      safeValue(next.updatedAt),
      safeValue(id),
    ],
  );

  return getOrderById(id);
}




async function getOrderById(id) {
  await initDatabase();
  const row = get(`SELECT * FROM orders WHERE id = ?`, [id]);
  return row ? hydrate(row) : null;
}

async function listOrders({ status } = {}) {
  await initDatabase();
  if (status) {
    return all(`SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC`, [
      status,
    ]).map(hydrate);
  }

  return all(`SELECT * FROM orders ORDER BY created_at DESC`).map(hydrate);
}

function hydrate(row) {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    total: row.total,
    currency: row.currency,
    status: row.status,
    paymentMethod: row.payment_method,
    paymentChannel: row.payment_channel,
    paymentLinkId: row.payment_link_id,
    paymentUrl: row.payment_url,
    items: safeParse(row.items),
    metadata: safeParse(row.metadata),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeParse(value) {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

module.exports = {
  createOrder,
  updateOrder,
  getOrderById,
  listOrders,
};
