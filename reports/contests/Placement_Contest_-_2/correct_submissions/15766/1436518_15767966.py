import math
def repairCars(ranks, cars):
    left = 1
    right = min(ranks)*(cars)*(cars)
    mini = right
    while left<=right:
        mid = (left + right) // 2
        total_repair = 0
        for r in ranks:
            total_repair+=math.floor(math.sqrt(mid/r))
        if total_repair>=cars:
            mini = mid
            right = mid - 1
        else:
            left = mid + 1
    return mini