#Maintainer: Alex Gajewski <agajews@gmail.com>

_pkgname='Apricity Chrome Profile'
pkgname=apricity-chrome-profile
pkgver=0.1.3
pkgrel=1
pkgdesc='Default Google Chrome Profile for Apricity OS'
arch=(any)
license=(GPL)
url="https://github.com/Apricity-OS/apricity-chrome-profile"
depends=()
source=("apricity-chrome-profile.tar.gz")
sha256sums=('27680a276e4e4564ace715f686703146f64eac1d20eb82838635e887ccb23124')

package() {
	mkdir -p "${pkgdir}/etc/apricity-assets"
	cp -rf "${srcdir}/apricity-chrome-profile/chrome-apps" "${pkgdir}/etc/apricity-assets"
	cp -rf "${srcdir}/apricity-chrome-profile/google-chrome" "${pkgdir}/etc/apricity-assets"
}
