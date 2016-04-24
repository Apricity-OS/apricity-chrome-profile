#Maintainer: Alex Gajewski <agajews@gmail.com>

_pkgname='Apricity Chrome Profile'
pkgname=apricity-chrome-profile
pkgver=0.1.4
pkgrel=1
pkgdesc='Default Google Chrome Profile for Apricity OS'
arch=(any)
license=(GPL)
url="https://github.com/Apricity-OS/apricity-chrome-profile"
depends=()
source=("apricity-chrome-profile.tar.gz")
sha256sums=('27be5797f8742b83974d427647e7abd64c1bd8325b6b29afafd8fa156b6bcf7d')

package() {
	mkdir -p "${pkgdir}/etc/apricity-assets"
	cp -rf "${srcdir}/apricity-chrome-profile/chrome-apps" "${pkgdir}/etc/apricity-assets"
	cp -rf "${srcdir}/apricity-chrome-profile/google-chrome" "${pkgdir}/etc/apricity-assets"
}
