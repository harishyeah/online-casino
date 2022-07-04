import { Loading } from "notiflix/build/notiflix-loading-aio";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

Loading.init({
  svgColor: "#076AFE",
});

Notify.init({
  clickToClose: true,
});

export const Spinner = {
  show: () => {
    Loading.circle();
  },
  hide: () => {
    Loading.remove();
  },
};

export const Alert = {
  success: (_msg = "") => {
    return Notify.success(_msg ? _msg : "Success");
  },
  warning: (_msg = "") => {
    Notify.warning(_msg ? _msg : "Warning");
  },
  info: (_msg = "") => {
    Notify.info(_msg ? _msg : "Info");
  },
  error: (_msg = "") => {
    Notify.failure(_msg ? _msg : "Error");
  },
  confirmAction:  (
    _title = null,
    _text = null,
    _confirmBtnText = null,
    _denyBtnText = null
  ) => {
		return new Promise((resolve) => {
			Confirm.show(
        _title ? _title : "Are you sure!",
        _text ? _text : "Want to perform this action?",
        _confirmBtnText ? _confirmBtnText : "Yes",
        _denyBtnText ? _denyBtnText : "No",
        () => {
          resolve(true);
        },
        () => {
          resolve(false);
        },
        {
          titleColor: "#B478B3",
          okButtonBackground: "#B478B3",
          messageMaxLength: 200,
        }
      );     
		})
	},
};
