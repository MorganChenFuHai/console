import {
  type Dataset,
  FeatureName,
  SizeType,
  LanguageOptions,
  TEXT_GENERATION,
  datasetClient,
} from '@/api/dataset';
import { reactive, ref, toRefs } from 'vue';
import { DatasetForRender, convertDatasetForRender } from '@/api/dataset-for-render';

const initialValue: DatasetForRender = {
  apiVersion: 'extension.datatunerx.io/v1beta1',
  kind: 'Dataset',
  metadata: {
    name: 'example-dataset',
  },
  spec: {
    datasetCard: {
      datasetCardRef: 'configmap-dataset-readme',
    },
    datasetFiles: {
      source: '',
    },
    datasetMetadata: {
      datasetInfo: {
        features: [
          {
            dataType: 'string',
            mapTo: 'Content',
            name: FeatureName.Instruction,
          },
          {
            dataType: 'string',
            mapTo: 'Result',
            name: FeatureName.Response,
          },
        ],
        subsets: [
          {
            name: 'Default',
            splits: {
              test: {
                file: '',
              },
              train: {
                file: '',
              },
              validate: {
                file: '',
              },
            },
          },
        ],
      },
      languages: [LanguageOptions.zh],
      plugin: {
        loadPlugin: false,
        name: '',
      },
      size: SizeType.SIZE_1K,
      tags: [],
      task: {
        name: TEXT_GENERATION,
        subTasks: [],
      },
    },
  },
};

export function useDataset() {
  const dataset = ref<DatasetForRender>(initialValue);

  const state = reactive({
    dataset,
    loading: false,
    datasets: [] as Dataset[],
  });

  const fetchDataset = async (namespace: string, name: string) => {
    await datasetClient.read(namespace, name).then((res) => {
      state.dataset = convertDatasetForRender(res.data);
    });
  };

  const fetchDatasets = async (namespace: string) => {
    await datasetClient.list(namespace).then((res) => {
      state.datasets = res.data.items;
    });
  };

  return {
    ...toRefs(state),
    fetchDataset,
    fetchDatasets,
  };
}
