def isPresent(n, nums, target):
    #write your code here
    start = 0
    end = n-1

    while end >= start:
        mid = (start+ end)//2

        if nums[mid] == target:
            return mid
        
        if nums[mid] < target:
            end = mid-1
        else:
            start = mid+1

    return -1