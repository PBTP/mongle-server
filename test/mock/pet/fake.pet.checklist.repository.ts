import {IPetChecklistRepository} from "../../../src/pet/port/pet.checklist.repository";
import {ChecklistType, PetChecklistCategory, PetChecklistEntity} from "../../../src/schemas/pet-checklist.entity";
import {PetChecklist} from "../../../src/pet/pet.checklist.domain";

export class FakePetChecklistRepository implements IPetChecklistRepository {
    private readonly checkLists: PetChecklistEntity[] = [];

    async findCheckList(
        category: PetChecklistCategory,
        type: ChecklistType,
        petId: number | null,
    ): Promise<PetChecklistEntity[]>{
        return this.checkLists.filter((checklist) => {
            const matchesType = (!type || checklist.petChecklistType === type);
            const matchesCategory = (!category || checklist.petChecklistCategory === category);

            return matchesCategory && matchesType;
        });
    };

    async findByIds(ids: number[]): Promise<PetChecklistEntity[]>{
        const findCheckList: PetChecklistEntity[] = this.checkLists.filter((cl:PetChecklistEntity)=>{
            return ids.includes(cl.petChecklistId);
        })
        if(findCheckList.length===0){
            throw new Error('PetChecklistEntity 목록을 찾을 수 없습니다.');
        }
        return findCheckList;
    };

    async create(dto: PetChecklist): Promise<PetChecklistEntity>{
        return new PetChecklistEntity();
    };
}