import { updateContainer } from '../commands';
export class ContainerService {
  public async update(): Promise<void> {
    try {
      const { stdout } = await updateContainer();

      console.log(`Update response: ${stdout}`);
    } catch (error) {
      console.error(error);
    }
  }
}
