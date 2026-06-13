import math
def repairCars(ranks, cars):
    n = len(ranks)
    left, right = 1, max(ranks) * cars * cars
    while left <= right:
        mid = (left + right) // 2
        score = 0
        for i in range(n):
            score += math.floor(math.sqrt(mid // ranks[i]))

        if score >= cars:
            right = mid - 1
        else:
            left = mid + 1
    return left