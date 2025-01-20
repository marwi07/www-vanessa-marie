export function generateDisplay(msg, data) {
  msg = ` <div id="Container Kontaktinfos" class="container_contact_profil">
                <dl id="Kontaktinfos" class="contact-profil">
                  <dt>Name:</dt>
                  <dd>${data[0][5]}</dd>
                  <dt>Email:</dt>
                  <dd>${data[0][0]}</dd>
                  <dt>Addresse:</dt>
                  <dd>${data[0][4]}</dd>
                  <dt>Telefon:</dt>
                  <dd>${data[0][1]}</dd>
                  <dt>Sonstiges:</dt>
                  <dd>${data[0][2]}</dd>
                </dl>
            </div><div class="button-group-profil">
            <a class="button-profil" href="/profil/bearbeiten">
              Bearbeiten
            </a>

            <a
              onclick="return confirmDelete()"
              class="button-profil"
              href="/profil/entfernen"
            >
              Löschen
            </a>
          </div>
          <script>
            function confirmDelete() {
              return confirm("Are you sure you want to delete this item?");
            }
          </script>
          
        </div>`;
  return msg;
}
