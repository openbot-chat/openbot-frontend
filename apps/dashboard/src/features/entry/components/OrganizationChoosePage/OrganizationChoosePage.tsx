import { api } from '@/utils/trpc-next';
import { 
  VStack,
  Button, 
  Input, 
  Card,
  Skeleton, 
  useToast,
  FormControl,
  FormLabel,
 } from '@chakra-ui/react';
import {
  signIn,
} from 'next-auth/react'
import { useRouter } from 'next/router';

export function OrganizationChoosePage() {
  const style = {
    background: `url('${process.env.STATIC_URL}/background-mask-20.png')`,
    backgroundSize: 'cover'
  };

  const router = useRouter()
  const callbackUrl = router.query.callbackUrl as string ?? '/';
  const toast = useToast()

  const { data: orgs, isFetching } = api.org.list.useQuery();
  const createOrgMutation = api.org.create.useMutation({
    onError: (error) => toast({ description: error.message, status: 'error' }),
    onSuccess: async (org) => {
      console.log('org created: ', org);
    },
  });

  const handleEntry = (organization: string) => {
    signIn('wechat:pc', 
      {
        callbackUrl,
      }, {
        organization,
      }
    );
  };

  const handleFinish = (values) => {
    createOrgMutation.mutateAsync(values);
  };

  return (
    <VStack w="full" className="h-screen justify-center items-center bg-blue-500" style={style}>
      <Card title="选择要登入的企业/组织" style={{ width: '800px' }}>
        <VStack w="full" className="h-full">
          {orgs && orgs.length > 0 && orgs?.map(org => (
            <Skeleton key={org.id} isLoaded={isFetching}>
              <Card onClick={() => handleEntry(org.id)} className="cursor-pointer">
                {org.name}
              </Card>
            </Skeleton>
          ))}
          {true && (
            <form onSubmit={handleFinish}>
              <FormControl>
                <FormLabel>名称</FormLabel>
                <Input/>
              </FormControl>
              <FormControl>
                <Button type="primary" htmlType="submit">保存</Button>
              </FormControl>
            </form>
          )}  
        </VStack>
      </Card>
    </VStack>
  );
}