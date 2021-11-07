import React, { useCallback, useEffect, useState } from 'react';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { useHistory, useParams } from 'react-router-dom';
import RoleForm from '../Forms/RoleForm';
import RoleFormSchema from './validations';
import { INITIAL_FORM_VALUES } from '../../../constants/role';
import { IResource, IRoleEditForm, IPermission } from '../../../interfaces/IRole';
import api from '../../../services/api';
import { useHeaderTitle } from '../../../contexts/headerTitle';

function Edit() {
  const [resources, setResources] = useState<IResource[]>([]);
  const history = useHistory();
  const [roleInfo, setRoleInfo] = useState<IRoleEditForm>(INITIAL_FORM_VALUES);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();

  const { setTitle } = useHeaderTitle();

  useEffect(() => {
    setTitle('Edição de função');
  }, []);

  useEffect(() => {
    (async () => {
      const response = await api.get('/resource', { params: { limit: 100 } });
      const { data } = response.data;

      const roleResponse = await api.get(`/role/${id}`);
      const { data: role } = roleResponse.data;

      setRoleInfo({
        role_name: role.name,
        resources: data.map((resource: IResource) => {
          const roleActions = role.permissions?.filter(
            (permission: IPermission) => permission.resource._id === resource._id
          )[0]?.actions;

          if (!roleActions) {
            return {
              actions: []
            };
          }

          return {
            actions: resource.availableActions.map(action => roleActions.includes(action))
          };
        })
      });

      setResources(data);
      setLoading(false);
    })();
  }, []);

  const roleMapper = useCallback(
    (values: IRoleEditForm) => {
      const permissions = values.resources
        .map((resource, rIndex) => ({
          resource: resources[rIndex]?._id,
          actions: resource.actions
            .map((action, aIndex) => action && resources[rIndex]?.availableActions[aIndex])
            .filter(value => !!value)
        }))
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

      api
        .put(`/role/${id}`, rolePayload)
        .then(() => {
          actions.setSubmitting(false);
          toast.success('Função atualizada com sucesso!');
          history.push('/role');
        })
        .catch(err => {
          if (err.response) {
            toast.error(`Falha na atualização da função: ${err.response.data.error}`);
            actions.setSubmitting(false);
          }
        });
    },
    [resources]
  );

  return loading ? null : (
    <Formik initialValues={roleInfo} validationSchema={RoleFormSchema} onSubmit={handleOnSubmit}>
      <RoleForm resources={resources} />
    </Formik>
  );
}

export default Edit;
