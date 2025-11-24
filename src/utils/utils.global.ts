import {createRef} from 'react';
import {AppointmentInformationModalMethods} from '../components/modals/appointment-information-modal';

export const appointmentInformationModalRef =
  createRef<AppointmentInformationModalMethods>();

export const openAppointmentInformationModal = (
  citaId: number,
  isDone?: boolean,
) => {
  console.log(
    'openAppointmentInformationModal llamado con citaId:',
    citaId,
    'isDone:',
    isDone,
  );
  console.log('Referencia del modal:', appointmentInformationModalRef?.current);
  appointmentInformationModalRef?.current?.open({citaId, isDone});
};
