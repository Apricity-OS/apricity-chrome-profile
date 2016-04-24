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
sha256sums=('a0f6ff51ae8f3c96b079d8128758759bed3b95a2cd9122d2c5306856453e56d9')

package() {
	mkdir -p "${pkgdir}/etc/apricity-assets"
	cp -rf "${srcdir}/apricity-chrome-profile/chrome-apps" "${pkgdir}/etc/apricity-assets"
	cp -rf "${srcdir}/apricity-chrome-profile/google-chrome" "${pkgdir}/etc/apricity-assets"
}
