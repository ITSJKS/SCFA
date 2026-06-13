def isPresent(n, nums, target):
    start = 0
    end = n-1

    while start <= end:
        mid = (start + end)//2

        if nums[mid] == target:
            return mid
        elif nums[mid] > target:
            start = mid + 1
        else:
            end = mid - 1
    
    return -1