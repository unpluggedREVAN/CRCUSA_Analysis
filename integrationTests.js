const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  connectFirestoreEmulator
} = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyBQLeE2PPVYDZkYl-cwOL2U_PrDKIQdeSc",
  authDomain: "crcusa-prod.firebaseapp.com",
  projectId: "crcusa-prod",
  storageBucket: "crcusa-prod.firebasestorage.app",
  messagingSenderId: "231208198711",
  appId: "1:231208198711:web:394be1f96ecda37ef3d5b2",
  measurementId: "G-J88KPZCH9V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

const testResults = [];

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logTestResult(testName, passed, error = null) {
  totalTests++;
  if (passed) {
    passedTests++;
    log(`[OK] ${testName}`, colors.green);
    testResults.push({ name: testName, status: 'OK' });
  } else {
    failedTests++;
    log(`[ERROR] ${testName}`, colors.red);
    if (error) {
      log(`  Error: ${error.message}`, colors.red);
    }
    testResults.push({ name: testName, status: 'ERROR', error: error?.message });
  }
}

const testData = {
  contact: {
    name: 'Test Contact Integration',
    email: 'test@integration.com',
    phone: '+1234567890',
    company: 'Test Company',
    status: 'activo',
    score: '85',
    interest: 'alto',
    probability: '75',
    origin: 'web',
    estimatedValue: '50000',
    location: 'San Francisco, CA',
    isPotential: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'test@user.com',
    initials: 'TC'
  },
  company: {
    name: 'Integration Test Inc',
    tradeName: 'IT Inc',
    email: 'info@itinc.com',
    phone: '+1987654321',
    website: 'https://itinc.com',
    sector: 'Tecnologia',
    size: '50-100',
    location: 'New York, NY',
    address: '123 Test Street',
    description: 'Test company for integration',
    latitude: 40.7128,
    longitude: -74.0060,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'test@user.com',
    initials: 'IT'
  },
  campaign: {
    title: 'Test Campaign',
    description: 'Integration test campaign',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    recipients: [
      {
        id: 'recipient-1',
        name: 'Test Recipient',
        email: 'recipient@test.com',
        type: 'contact',
        status: 'sin_contestar'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'test@user.com'
  },
  note: {
    title: 'Test Note',
    content: 'This is a test note for integration testing',
    owner: 'test@user.com',
    x: 100,
    y: 100,
    width: 300,
    height: 200,
    color: '#ffeb3b',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  affiliate: {
    name: 'Test Affiliate',
    email: 'affiliate@test.com',
    phone: '+1122334455',
    company: 'Affiliate Company',
    status: 'activo',
    commissionRate: '10',
    totalSales: '25000',
    tier: 'Gold',
    joinDate: new Date().toISOString(),
    location: 'Los Angeles, CA',
    performanceScore: '92',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'test@user.com',
    initials: 'TA'
  },
  sponsor: {
    name: 'Test Sponsor',
    company: 'Sponsor Corp',
    email: 'sponsor@test.com',
    phone: '+1555666777',
    sponsorshipType: 'Gold',
    amount: '100000',
    status: 'activo',
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    benefits: 'Logo placement, booth space',
    location: 'Miami, FL',
    website: 'https://sponsorcorp.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    owner: 'test@user.com',
    initials: 'TS'
  }
};

const createdIds = {
  contacts: [],
  companies: [],
  campaigns: [],
  notes: [],
  affiliates: [],
  sponsors: [],
  connections: []
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
  log('\n' + '='.repeat(60), colors.bold);
  log('PRUEBAS DE INTEGRACION FIRESTORE - CRCUSA', colors.bold + colors.blue);
  log('='.repeat(60) + '\n', colors.bold);

  log('Iniciando pruebas de integracion...', colors.yellow);
  log('Fecha: ' + new Date().toLocaleString(), colors.yellow);
  log('\n' + '-'.repeat(60) + '\n', colors.yellow);

  try {
    await testContacts();
    await testCompanies();
    await testCampaigns();
    await testNotes();
    await testConnections();
    await testAffiliates();
    await testSponsors();
  } catch (error) {
    log(`Error general en las pruebas: ${error.message}`, colors.red);
    console.error(error.stack);
  } finally {
    await cleanup();
    printSummary();
  }
}

async function testContacts() {
  log('PRUEBAS DE CONTACTOS\n', colors.bold + colors.blue);

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'contacts'), testData.contact);
    createdIds.contacts.push(docRef.id);
    logTestResult('Caso 1: Crear contacto', true);
  } catch (error) {
    logTestResult('Caso 1: Crear contacto', false, error);
  }

  try {
    await delay(200);
    const contacts = await getDocs(collection(db, 'contacts'));
    logTestResult('Caso 2: Listar contactos', contacts.docs.length > 0);
  } catch (error) {
    logTestResult('Caso 2: Listar contactos', false, error);
  }

  if (createdIds.contacts.length > 0) {
    try {
      await delay(200);
      const docRef = doc(db, 'contacts', createdIds.contacts[0]);
      const docSnap = await getDoc(docRef);
      logTestResult('Caso 3: Obtener contacto por ID', docSnap.exists());
    } catch (error) {
      logTestResult('Caso 3: Obtener contacto por ID', false, error);
    }

    try {
      await delay(200);
      const docRef = doc(db, 'contacts', createdIds.contacts[0]);
      await updateDoc(docRef, { name: 'Updated Contact Name' });
      logTestResult('Caso 4: Actualizar contacto', true);
    } catch (error) {
      logTestResult('Caso 4: Actualizar contacto', false, error);
    }
  }

  log('');
}

async function testCompanies() {
  log('PRUEBAS DE EMPRESAS\n', colors.bold + colors.blue);

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'companies'), testData.company);
    createdIds.companies.push(docRef.id);
    logTestResult('Caso 5: Crear empresa', true);
  } catch (error) {
    logTestResult('Caso 5: Crear empresa', false, error);
  }

  try {
    await delay(200);
    const companies = await getDocs(collection(db, 'companies'));
    logTestResult('Caso 6: Listar empresas', companies.docs.length > 0);
  } catch (error) {
    logTestResult('Caso 6: Listar empresas', false, error);
  }

  if (createdIds.companies.length > 0) {
    try {
      await delay(200);
      const docRef = doc(db, 'companies', createdIds.companies[0]);
      const docSnap = await getDoc(docRef);
      logTestResult('Caso 7: Obtener empresa por ID', docSnap.exists());
    } catch (error) {
      logTestResult('Caso 7: Obtener empresa por ID', false, error);
    }

    try {
      await delay(200);
      const docRef = doc(db, 'companies', createdIds.companies[0]);
      await updateDoc(docRef, { sector: 'Tecnologia Avanzada' });
      logTestResult('Caso 8: Actualizar empresa', true);
    } catch (error) {
      logTestResult('Caso 8: Actualizar empresa', false, error);
    }
  }

  log('');
}

async function testCampaigns() {
  log('PRUEBAS DE CAMPANAS\n', colors.bold + colors.blue);

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'campaigns'), testData.campaign);
    createdIds.campaigns.push(docRef.id);
    logTestResult('Caso 9: Crear campana', true);
  } catch (error) {
    logTestResult('Caso 9: Crear campana', false, error);
  }

  try {
    await delay(200);
    const campaigns = await getDocs(collection(db, 'campaigns'));
    logTestResult('Caso 10: Listar campanas', campaigns.docs.length > 0);
  } catch (error) {
    logTestResult('Caso 10: Listar campanas', false, error);
  }

  if (createdIds.campaigns.length > 0) {
    try {
      await delay(200);
      const docRef = doc(db, 'campaigns', createdIds.campaigns[0]);
      const docSnap = await getDoc(docRef);
      logTestResult('Caso 11: Obtener campana por ID', docSnap.exists());
    } catch (error) {
      logTestResult('Caso 11: Obtener campana por ID', false, error);
    }

    try {
      await delay(200);
      const docRef = doc(db, 'campaigns', createdIds.campaigns[0]);
      const updatedRecipients = testData.campaign.recipients.map(r => ({
        ...r,
        status: 'aceptado'
      }));
      await updateDoc(docRef, { recipients: updatedRecipients });
      logTestResult('Caso 12: Actualizar estado de destinatario', true);
    } catch (error) {
      logTestResult('Caso 12: Actualizar estado de destinatario', false, error);
    }
  }

  log('');
}

async function testNotes() {
  log('PRUEBAS DE NOTAS\n', colors.bold + colors.blue);

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'notes'), testData.note);
    createdIds.notes.push(docRef.id);
    logTestResult('Caso 13: Crear nota', true);
  } catch (error) {
    logTestResult('Caso 13: Crear nota', false, error);
  }

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'notes'), {
      ...testData.note,
      title: 'Second Note',
      x: 450,
      y: 100
    });
    createdIds.notes.push(docRef.id);
    logTestResult('Caso 14: Crear segunda nota', true);
  } catch (error) {
    logTestResult('Caso 14: Crear segunda nota', false, error);
  }

  try {
    await delay(200);
    const notes = await getDocs(collection(db, 'notes'));
    logTestResult('Caso 15: Listar notas', notes.docs.length > 0);
  } catch (error) {
    logTestResult('Caso 15: Listar notas', false, error);
  }

  if (createdIds.notes.length > 0) {
    try {
      await delay(200);
      const docRef = doc(db, 'notes', createdIds.notes[0]);
      await updateDoc(docRef, {
        x: 150,
        y: 150,
        updatedAt: new Date().toISOString()
      });
      logTestResult('Caso 16: Actualizar posicion de nota', true);
    } catch (error) {
      logTestResult('Caso 16: Actualizar posicion de nota', false, error);
    }
  }

  log('');
}

async function testConnections() {
  log('PRUEBAS DE CONEXIONES\n', colors.bold + colors.blue);

  if (createdIds.notes.length >= 2) {
    try {
      await delay(200);
      const connectionData = {
        fromNoteId: createdIds.notes[0],
        toNoteId: createdIds.notes[1]
      };
      const docRef = await addDoc(collection(db, 'connections'), connectionData);
      createdIds.connections.push(docRef.id);
      logTestResult('Caso 17: Crear conexion entre notas', true);
    } catch (error) {
      logTestResult('Caso 17: Crear conexion entre notas', false, error);
    }

    try {
      await delay(200);
      const connections = await getDocs(collection(db, 'connections'));
      logTestResult('Caso 18: Listar conexiones', connections.docs.length > 0);
    } catch (error) {
      logTestResult('Caso 18: Listar conexiones', false, error);
    }

    try {
      await delay(200);
      const q = query(
        collection(db, 'connections'),
        where('fromNoteId', '==', createdIds.notes[0])
      );
      const querySnapshot = await getDocs(q);
      logTestResult('Caso 19: Buscar conexiones por nota origen', querySnapshot.docs.length > 0);
    } catch (error) {
      logTestResult('Caso 19: Buscar conexiones por nota origen', false, error);
    }
  } else {
    logTestResult('Caso 17: Crear conexion entre notas', false, new Error('No hay suficientes notas'));
    logTestResult('Caso 18: Listar conexiones', false, new Error('No hay suficientes notas'));
    logTestResult('Caso 19: Buscar conexiones por nota origen', false, new Error('No hay suficientes notas'));
  }

  log('');
}

async function testAffiliates() {
  log('PRUEBAS DE AFILIADOS\n', colors.bold + colors.blue);

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'affiliates'), testData.affiliate);
    createdIds.affiliates.push(docRef.id);
    logTestResult('Caso 20: Crear afiliado', true);
  } catch (error) {
    logTestResult('Caso 20: Crear afiliado', false, error);
  }

  try {
    await delay(200);
    const affiliates = await getDocs(collection(db, 'affiliates'));
    logTestResult('Caso 21: Listar afiliados', affiliates.docs.length > 0);
  } catch (error) {
    logTestResult('Caso 21: Listar afiliados', false, error);
  }

  if (createdIds.affiliates.length > 0) {
    try {
      await delay(200);
      const docRef = doc(db, 'affiliates', createdIds.affiliates[0]);
      await updateDoc(docRef, {
        totalSales: '30000',
        performanceScore: '95'
      });
      logTestResult('Caso 22: Actualizar metricas de afiliado', true);
    } catch (error) {
      logTestResult('Caso 22: Actualizar metricas de afiliado', false, error);
    }
  }

  log('');
}

async function testSponsors() {
  log('PRUEBAS DE PATROCINADORES\n', colors.bold + colors.blue);

  try {
    await delay(200);
    const docRef = await addDoc(collection(db, 'sponsors'), testData.sponsor);
    createdIds.sponsors.push(docRef.id);
    logTestResult('Caso 23: Crear patrocinador', true);
  } catch (error) {
    logTestResult('Caso 23: Crear patrocinador', false, error);
  }

  log('');
}

async function cleanup() {
  log('\nLIMPIEZA DE DATOS DE PRUEBA\n', colors.bold + colors.yellow);

  for (const id of createdIds.contacts) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'contacts', id));
      log(`  [OK] Contacto ${id} eliminado`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar contacto ${id}: ${error.message}`, colors.red);
    }
  }

  for (const id of createdIds.companies) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'companies', id));
      log(`  [OK] Empresa ${id} eliminada`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar empresa ${id}: ${error.message}`, colors.red);
    }
  }

  for (const id of createdIds.campaigns) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'campaigns', id));
      log(`  [OK] Campana ${id} eliminada`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar campana ${id}: ${error.message}`, colors.red);
    }
  }

  for (const id of createdIds.connections) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'connections', id));
      log(`  [OK] Conexion ${id} eliminada`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar conexion ${id}: ${error.message}`, colors.red);
    }
  }

  for (const id of createdIds.notes) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'notes', id));
      log(`  [OK] Nota ${id} eliminada`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar nota ${id}: ${error.message}`, colors.red);
    }
  }

  for (const id of createdIds.affiliates) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'affiliates', id));
      log(`  [OK] Afiliado ${id} eliminado`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar afiliado ${id}: ${error.message}`, colors.red);
    }
  }

  for (const id of createdIds.sponsors) {
    try {
      await delay(100);
      await deleteDoc(doc(db, 'sponsors', id));
      log(`  [OK] Patrocinador ${id} eliminado`, colors.green);
    } catch (error) {
      log(`  [ERROR] Error al eliminar patrocinador ${id}: ${error.message}`, colors.red);
    }
  }

  log('');
}

function printSummary() {
  log('='.repeat(60), colors.bold);
  log('RESUMEN DE PRUEBAS', colors.bold + colors.blue);
  log('='.repeat(60) + '\n', colors.bold);

  log(`Total de pruebas: ${totalTests}`, colors.bold);
  log(`Exitosas: ${passedTests}`, colors.green + colors.bold);
  log(`Fallidas: ${failedTests}`, colors.red + colors.bold);
  log(`Tasa de exito: ${((passedTests / totalTests) * 100).toFixed(2)}%\n`, colors.yellow + colors.bold);

  log('Detalle de resultados:\n', colors.bold);
  testResults.forEach((result, index) => {
    const status = result.status === 'OK'
      ? `${colors.green}OK${colors.reset}`
      : `${colors.red}ERROR${colors.reset}`;
    log(`  ${index + 1}. ${result.name}: ${status}`);
    if (result.error) {
      log(`     ${colors.red}${result.error}${colors.reset}`);
    }
  });

  log('\n' + '='.repeat(60) + '\n', colors.bold);

  if (failedTests === 0) {
    log('TODAS LAS PRUEBAS PASARON EXITOSAMENTE!', colors.green + colors.bold);
  } else {
    log(`ATENCION: ${failedTests} prueba(s) fallaron`, colors.red + colors.bold);
  }

  log('\n' + '='.repeat(60) + '\n', colors.bold);
}

runTests().then(() => {
  process.exit(failedTests > 0 ? 1 : 0);
}).catch(error => {
  log(`\nError fatal: ${error.message}`, colors.red + colors.bold);
  console.error(error);
  process.exit(1);
});
