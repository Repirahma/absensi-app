document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('absenForm');
  const status = document.getElementById('status');

  const kampusLat = -6.9407497;
  const kampusLon = 107.6220404;
  const radiusMax = 200; // dalam meter

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      status.textContent = "Geolokasi tidak didukung di perangkat ini.";
      return;
    }

    navigator.geolocation.getCurrentPosition(pos => {
      const { latitude, longitude } = pos.coords;
      const distance = getDistanceFromLatLonInMeters(latitude, longitude, kampusLat, kampusLon);

      if (distance <= radiusMax) {
        const absen = {
          nama: document.getElementById('nama').value,
          nim: document.getElementById('nim').value,
          kelas: document.getElementById('kelas').value,
          tanggal: new Date().toLocaleString(),
          lokasi: `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`
        };

        const absensiSebelumnya = JSON.parse(localStorage.getItem('absensi')) || [];
        absensiSebelumnya.push(absen);
        localStorage.setItem('absensi', JSON.stringify(absensiSebelumnya));

        status.textContent = "Absensi berhasil!";
      } else {
        status.textContent = `Anda berada di luar radius kampus (${distance.toFixed(2)} meter)`;
      }
    }, () => {
      status.textContent = "Gagal mendapatkan lokasi.";
    });
  });

  function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
});
