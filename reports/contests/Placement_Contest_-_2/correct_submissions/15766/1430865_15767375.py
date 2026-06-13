import math

def helper(time, ranks, cars):
    total_cars = 0

    for rank in ranks:
        cars_assigned = int(math.sqrt(time / rank))
        total_cars += cars_assigned
    
    if total_cars == cars:
        return 0
    if total_cars > cars:
        return True
    
    return False


def repairCars(ranks, cars):
    left = 1
    ranks.sort()
    right = ranks[0] * cars * cars

    # if ranks[0] == ranks[-1] == 1 and len(ranks) == cars:
    #     return 1

    while (left <= right):
        mid = (left + right) // 2

        # if helper(mid, ranks, cars) == 0:
        #     return mid

        if helper(mid, ranks, cars):
            right = mid - 1
        else:
            left = mid + 1
        
    
    return left