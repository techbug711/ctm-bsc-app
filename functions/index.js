const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// Helper to strictly enforce Malaysian Timezone (GMT+8) for accurate daily bins
function getKLDateString(timestampMs) {
    const date = timestampMs ? new Date(timestampMs) : new Date();
    // en-CA natively formats as YYYY-MM-DD
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

// 📥 TRIGGER 1: When a new parcel is scanned IN
exports.aggregateInbound = onDocumentCreated('shops/{shopId}/active_parcels/{awb}', async (event) => {
    const snap = event.data;
    if (!snap) return; // Defensive check

    const data = snap.data();
    const shopId = event.params.shopId;
    const awb = event.params.awb;

    const isYoyi = awb.startsWith('680');
    const platform = isYoyi ? 'yoyi' : 'spx';

    // Extract accurate timestamp
    const itemTime = data.timestamp?.toMillis ? data.timestamp.toMillis() : (data.timestamp || Date.now());
    const dateStr = getKLDateString(itemTime);

    // Point to the specific day's scoreboard
    const statsRef = db.collection('shops').doc(shopId).collection('daily_stats').doc(dateStr);

    // Atomically increment the exact platform counter by 1
    await statsRef.set({
        [`inbound_${platform}`]: admin.firestore.FieldValue.increment(1)
    }, { merge: true });
});

// 📤 TRIGGER 2: When a parcel is collected OUT
exports.aggregateOutbound = onDocumentCreated('shops/{shopId}/collected_parcels/{awb}', async (event) => {
    const snap = event.data;
    if (!snap) return; // Defensive check

    const data = snap.data();
    const shopId = event.params.shopId;
    const awb = event.params.awb;

    const isYoyi = awb.startsWith('680');
    const platform = isYoyi ? 'yoyi' : 'spx';

    // Extract accurate timestamp
    const colTime = data.collectedAt?.toMillis ? data.collectedAt.toMillis() : (data.collectedAt || Date.now());
    const dateStr = getKLDateString(colTime);

    // Point to the specific day's scoreboard
    const statsRef = db.collection('shops').doc(shopId).collection('daily_stats').doc(dateStr);

    // Atomically increment the exact platform counter by 1
    await statsRef.set({
        [`outbound_${platform}`]: admin.firestore.FieldValue.increment(1)
    }, { merge: true });
});