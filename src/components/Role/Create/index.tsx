import React, { useCallback, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import RoleForm from '../Forms/RoleForm';
import RoleFormSchema from './validations';
import { INITIAL_FORM_VALUES } from '../../../constants/role';
import { IResource, IRoleEditForm } from '../../../interfaces/IRole';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';

function Register() {
  const [resources, setResources] = useState<IResource[]>([]);
  const history = useHistory();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Criação de função');
  }, []);

  useEffect(() => {
    api.get('/resource', { params: { limit: 100 } }).then(response => {
      const { data } = response.data;

      setResources(data);
    });
  }, []);

  const roleMapper = useCallback(
    (values: IRoleEditForm) => {
      console.log(values.resources);
      const permissions = values.resources
        .map((resource, rIndex) =>
          resource
            ? {
                resource: resources[rIndex]?._id,
                actions: resource.actions
                  .map((action, aIndex) => action && resources[rIndex]?.availableActions[aIndex])
                  .filter(value => !!value)
              }
            : null
        )
        .filter(resource => !!resource);

      return {
        name: values.role_name,
        permissions
      };
    },
    [resources]
  );

  const handleOnSubmit = useCallback(
    (values, actions) => {
      const rolePayload = roleMapper(values);
      console.log(rolePayload);

      api
        .post('/role', rolePayload)
        .then(() => {
          actions.setSubmitting(false);
          toast.success('Função criada com sucesso!');
          history.push('/role');
        })
        .catch(err => {
          if (err.response) {
            toast.error(`Falha na criação da função: ${err.response.data.error}`);
            actions.setSubmitting(false);
          }
        });
    },
    [resources]
  );

  return (
    <Formik initialValues={INITIAL_FORM_VALUES} validationSchema={RoleFormSchema} onSubmit={handleOnSubmit}>
      <RoleForm resources={resources} />
    </Formik>
  );
}

export default Register;
