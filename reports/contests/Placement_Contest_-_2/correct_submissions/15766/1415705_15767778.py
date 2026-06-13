import math

def repairCars(ranks, cars):

    s = 1
    e = min(ranks) * cars * cars   # upper bound

    ans = e

    while s <= e:
        mid = (s + e) // 2

        total = 0

        for r in ranks:
            total += int(math.sqrt(mid // r))   # no early break

        if total >= cars:
            ans = mid
            e = mid - 1
        else:
            s = mid + 1

    return ans