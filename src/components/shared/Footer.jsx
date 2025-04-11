import React from 'react';

const Footer = () => {
  return (
    <footer
      className="text-center text-lg-start text-white"
      style={{ backgroundColor: '#04325B' }}
    >
      <div className="container p-4 pb-0">
        <section>
          <div className="row">
            <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">
                EGA SHOP
              </h6>
              <p>
              Chào mừng bạn đến với EGA SHOP. Chuyên cung cấp các sản phẩm công nghệ điện máy chính hãng, 
              chất lượng cao.
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Danh mục</h6>
              <p>
                <a className="text-white" href="#!">Laptop</a>
              </p>
              <p>
                <a className="text-white" href="#!">Điện thoại</a>
              </p>
              <p>
                <a className="text-white" href="#!">Tủ lạnh</a>
              </p>
              <p>
                <a className="text-white" href="#!">Máy giặt</a>
              </p>
            </div>

            <hr className="w-100 clearfix d-md-none" />

            <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Liên hệ</h6>
              <p>
                <i className="fas fa-home mr-3"></i> HaNoi, HN 10012, VN
              </p>
              <p>
                <i className="fas fa-envelope mr-3"></i> info@gmail.com
              </p>
              <p>
                <i className="fas fa-phone mr-3"></i> + 01 234 567 88
              </p>
              <p>
                <i className="fas fa-print mr-3"></i> + 01 234 567 89
              </p>
            </div>

            <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
              <h6 className="text-uppercase mb-4 font-weight-bold">Theo dõi chúng tôi</h6>
              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: '#3b5998' }}
                href="#!"
                role="button"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: '#55acee' }}
                href="#!"
                role="button"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: '#dd4b39' }}
                href="#!"
                role="button"
              >
                <i className="fab fa-google"></i>
              </a>
              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: '#ac2bac' }}
                href="#!"
                role="button"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: '#0082ca' }}
                href="#!"
                role="button"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                className="btn btn-primary btn-floating m-1"
                style={{ backgroundColor: '#333333' }}
                href="#!"
                role="button"
              >
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </section>
      </div>

      <div
        className="text-center p-3"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
      >
        © 2025 Copyright: Gnut
      </div>
    </footer>
  );
};

export default Footer;