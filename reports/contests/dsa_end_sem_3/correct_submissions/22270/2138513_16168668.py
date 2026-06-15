def isPresent(n, nums, target):
    #write your code here
    def binary_search(nums,target):
        start=0 
        end=len(nums)-1 
        while start<=end:
            mid=(start+end)//2 
            if nums[mid]==target:
                return mid 
            elif nums[mid]<target:
                end=mid-1 
            else:
                start=mid+1 
        return -1 
    return binary_search(nums,target)