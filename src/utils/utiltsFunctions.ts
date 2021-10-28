export function formatDoc(doc: string, type: string) {
  const initialDoc = doc.replace(/[^\d]/g, '');

  if (type === 'f') return initialDoc.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

  return initialDoc.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
}

export function formatTel(tel: string) {
  const initialDoc = tel.replace(/[^\d]/g, '');

  return initialDoc.replace(/^(\d{2})(\d{4,5})(\d{4})$/, '($1) $2-$3');
}
