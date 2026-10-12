import { productsForTopic, referencesByTopic, researchReferences, researchTopics } from '../app/lib/research';

describe('research references', () => {
  const topicIds = new Set(researchTopics.map((t) => t.id));

  test('ids, titles and links are unique', () => {
    for (const key of ['id', 'title', 'url'] as const) {
      const values = researchReferences.map((r) => r[key]);
      expect(new Set(values).size).toBe(values.length);
    }
  });

  test('every reference has a citation and a web link', () => {
    for (const ref of researchReferences) {
      expect(ref.title.length).toBeGreaterThan(0);
      expect(ref.source.length).toBeGreaterThan(0);
      expect(ref.year).toBeGreaterThan(1900);
      expect(ref.url).toMatch(/^https?:\/\/[^\s]+$/);
      expect(ref.url).not.toMatch(/chrome-extension:/);
    }
  });

  test('every reference belongs to known topics', () => {
    for (const ref of researchReferences) {
      expect(ref.topics.length).toBeGreaterThan(0);
      for (const id of ref.topics) expect(topicIds.has(id)).toBe(true);
    }
  });

  test('ingredient topics link to products that use them', () => {
    for (const topic of researchTopics.filter((t) => t.ingredients.length > 0)) {
      expect(productsForTopic(topic).length).toBeGreaterThan(0);
    }
  });

  test('every reference is listed exactly once', () => {
    const listed = referencesByTopic().flatMap((g) => g.references.map((r) => r.id));
    expect(listed.sort()).toEqual(researchReferences.map((r) => r.id).sort());
  });
});
